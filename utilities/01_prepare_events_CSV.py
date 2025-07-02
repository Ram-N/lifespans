"""
    Updated: 2023-02-22
    Ram Narasimhan

    Module to SORT and UPDATE the file `events_master.csv.`


    Input: data/events_master.csv (with new events added to the bottom)
    Output: data/events_master.csv
    Output: data/bkup/{TODAY}_events_master.csv

"""

import pandas as pd
import numpy as np
from datetime import date


def main():
    master_file = "../data/events_master.csv"
    df = pd.read_csv(master_file, encoding="ISO-8859-1")
    df = df.replace(
        r"^\s+$", np.nan, regex=True
    )  # get rid of unwanted blank spaces in cells...

    # Get rid of non-ASCII characters [^\x00-\x7f]
    # special case of 's [^\x00-\x7f]s
    offending_pattern = r"[^\x00-\x7f]s "
    new_pattern = "'s "
    df = df.replace(offending_pattern, new_pattern, regex=True)

    offending_pattern = r"[^\x00-\x7f]"
    new_pattern = " "
    df = df.replace(offending_pattern, new_pattern, regex=True)

    df["event"] = df["event"].str.strip()
    print(f"{df.shape[0]} events")
    print(df.columns)

    # might need to do this for other columns as well.
    categories = ["Asia", "China", "Britain", "Roman", "America"]
    for c in categories:
        df = df.astype({c: "float64"})

    # Check that the master file doesn't have any corrupted cells
    print(f'{df.select_dtypes("object").columns} columns are of type Object')

    obj_columns = ["stem", "event", "details", "wikipedia", "mnemonic", "categories"]
    for c in df.select_dtypes("object").columns:
        if c not in obj_columns:
            print("Object Type Column Error", c)
        else:
            print(f"Object type columns okay in {c}: OKAY")

    print(f'Unique values in ItemDiff {df["itemDifficulty"].unique()}')
    validate_01_columns(df)
    # end of all validations

    # Create a new column in the DataFrame `df` that contains numerical values corresponding to the year of each event or observation
    # Sort the DataFrame `df` by the values in the "YearNum" column in ascending order
    # Add a new column to the DataFrame `df` called "eventID", which contains a sequence of integers starting from 0 and ending at the number of rows in `df`

    print("Creating YearNum Column")
    df = create_yearnum_column(df)

    df = df.sort_values(by="YearNum")
    print("Finished Sorting by Date")

    df["eventID"] = range(0, df.shape[0])

    today = date.today()
    print(f"Today is {today}\n")
    csvfilename = f"../data/bkup/{today}_events.csv"
    df.to_csv(csvfilename, index=False)
    print(f"wrote file {csvfilename}")
    print(f"Now, go ahead and run\n")
    print(f"cp {csvfilename} ../data/events_master.csv")


def getYearNum(x):

    # print(x)
    mult = 1
    if "BC" in x:
        x = x.replace("BC", "")
        mult = -1
    x = x.replace("c.", "")  # handle circa
    x = x.replace("AD", "")

    try:
        yr = mult * int(x)
    except:
        print("CONVERSION ERROR while attempting...")
        print(x)
        yr = x

    return yr


def create_yearnum_column(df):
    df["YearNum"] = df["stem"].apply(getYearNum)
    return df


def validate_01_columns(df):
    cols01 = ["America", "Roman", "Greek", "China", "India"]
    for c in cols01:
        if len(df[c].unique()) != 2:
            print(f"Unexpected value in {c}: {df[c].unique()}")
    print("Zero One column  Validation complete")


if __name__ == "__main__":
    main()  # -i dirname

