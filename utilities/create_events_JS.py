"""
    Updated: 2022-04-17
    Ram Narasimhan

    Module to update eventsDB.js

    Input: data/events_master.csv
    Output: data/eventsDB.js
    Output: data/bkup/{TODAY}_eventsDB.js

"""

import pandas as pd
import numpy as np

# import json
# import os
from datetime import date


def main():

    master_file = "../data/events_master.csv"
    df = pd.read_csv(master_file, encoding="ISO-8859-1")
    df = df.replace(
        r"^\s+$", np.nan, regex=True
    )  # get rid of unwanted blank spaces in cells...

    df["event"] = df["event"].str.strip()
    print(f"{df.shape[0]} events")
    print(df.columns)

    diffcat = pd.cut(df["itemDifficulty"], bins=3, labels=["E", "M", "H"])
    df["diffCat"] = diffcat

    bins = [-15000, 0, 500, 1000, 1500, 1700, 1800, 1900, 2100]
    labels = [
        "BCE",
        "0AD-500AD",
        "500AD-1000AD",
        "1000AD-1500AD",
        "1500AD-1700AD",
        "1700s",
        "1800s",
        "1900-Present",
    ]
    df["timePeriod"] = pd.cut(df["YearNum"], bins=bins, labels=labels)
    altuples = [("altsMid", "Medium"), ("altsHard", "Hard"), ("altsEasy", "Easy")]

    for a in altuples:
        col, lvl = a
        print(col, lvl)
        df[col] = df["stem"].apply(get_alternatives, difflevel=lvl)
        print(f"{df[col].isnull().sum()} missing")
        fewest_options = df[col].apply(len).min()
        print(f" fewest options are {fewest_options}")

    print("df now has 3 new columns with Alternatives")

    # Just for visual inspections
    cond = df[col].apply(len) == fewest_options
    print(df[cond][col])

    # WRITE TO FILE
    today = date.today()
    print(f"Today's date: {today}")
    csvfilename = f"../data/bkup/{today}_eventsDB.csv"
    df.to_csv(csvfilename, index=False)
    print(f"wrote file {csvfilename}")

    # CREATE A JS FILE
    bigstring = df.T.to_json()
    outJSfile = f"../data/eventsDB.js"
    with open(outJSfile, "w") as text_file:
        text_file.write("events = " + bigstring)

    print(f"{outJSfile} written")

    added_columns = [
        "YearNum",
        "timePeriod",
        "altsMid",
        "altsHard",
        "altsEasy",
        "stem",
        "diffCat",
    ]
    for c in added_columns:
        print(c in df.columns)

    print(df.shape)

    print(f"{outJSfile} ready")


def get_alternatives(_str, difflevel="Hard"):

    nums = [int(s) for s in _str.split() if s.isdigit()]
    numstr = [s for s in _str.split() if s.isdigit()]

    diff_perturbs = [100, 50, 20, 10, 5, 2, 1]
    med_perturbs = [100, 20, 10, 5]
    easy_perturbs = [200, 100, 50, 20]

    perturbationDict = {
        "Hard": diff_perturbs,
        "Medium": med_perturbs,
        "Easy": easy_perturbs,
    }

    options = None
    perturbs = perturbationDict[difflevel]

    if "BC" in _str:
        if "c." in _str:  # circa BC, so give only approx alternatives.
            _str = _str.replace("c.", "")
            _str = _str.replace("BC", "")
            nums = [int(s) for s in _str.split() if s.isdigit()]
            numstr = [s for s in _str.split() if s.isdigit()]
            if len(nums) == 1:
                nstr = numstr[0]
                if nstr[-3:] == "000":
                    part = int(nstr[:-3])
                    options = get_valid_BC_alts(part, perturbs)
                    return [f" c. {x}000 BC" for x in options if x > 0]

                if nstr[-2:] == "00":
                    part = int(nstr[:-2])
                    options = get_valid_BC_alts(part, perturbs)
                    return [f" c. {x}00 BC" for x in options if x > 0]

                if nstr[-1] == "0":
                    part = int(nstr[:-1])
                    options = get_valid_BC_alts(part, perturbs)
                    return [f" c. {x}0 BC" for x in options if x > 0]
                else:
                    numpart = int(nstr)
                    options = get_valid_BC_alts(numpart, perturbs)
                    return [f" c. {x} BC" for x in options if x > 0]

        # case where there is BC but not circa
        # Exact BC year is presumed known
        elif len(nums) == 1:
            part = int(nums[0])
            options = get_valid_alts(part, perturbs)
            return [f"{x} BC" for x in options if x > 0]

        else:  # something not right
            print(f"something not right for {_str}")
            return _str

    elif "c.AD" in _str:
        if len(nums) == 1:
            a = nums[0]
            options = get_valid_alts(a, perturbs)
            return [f"c. {x} AD" for x in options]
        else:
            print(f"Error in {_str} {nums}")

    else:  # AD single number event
        nums = [int(s) for s in _str.split() if s.isdigit()]
        if len(nums) == 1:
            numpart = nums[0]
            options = get_valid_alts(numpart, perturbs)

        return options


# Add 3 new columns for Alternatives ("Wrong Answers")
# altsEasy
# altsMed
# altsHard
def get_valid_alts(baseyr, perturbs):
    """
    returns a list of valid distractors
    
    baseyr is the correct year. 
    @perturbs is a list of numbers to be added or subtracted
    """
    options = [baseyr + p for p in perturbs] + [baseyr + (-1 * p) for p in perturbs]
    return [dte for dte in options if (dte > 0 and dte < 2000)]


def get_valid_BC_alts(baseyr, perturbs):
    """
    returns a list of valid distractors
    
    baseyr is the correct year. 
    @perturbs is a list of numbers to be added or subtracted
    """
    perturbs = [1, 2, 5]
    options = [baseyr + p for p in perturbs] + [baseyr + (-1 * p) for p in perturbs]
    return [dte for dte in options if (dte > 0 and dte < 2000)]


if __name__ == "__main__":
    main()

