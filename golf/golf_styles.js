// Modern styling adjustments for History Golf
// This script runs after golf.js to apply our modern styling

// First add style guide color variables to the document root
document.documentElement.style.setProperty('--rich-black', '#03071e');
document.documentElement.style.setProperty('--chocolate-cosmos', '#370617');
document.documentElement.style.setProperty('--rosewood', '#6a040f');
document.documentElement.style.setProperty('--dark-moss-green', '#606c38');
document.documentElement.style.setProperty('--pakistan-green', '#283618');
document.documentElement.style.setProperty('--cornsilk', '#fefae0');
document.documentElement.style.setProperty('--earth-yellow', '#dda15e');
document.documentElement.style.setProperty('--tigers-eye', '#bc6c25');

document.addEventListener('DOMContentLoaded', () => {
  // Wait for the main script to initialize the UI
  setTimeout(() => {
    // Update main elements with modern styling
    const output = document.querySelector('.output');
    if (output) {
      output.classList.add('container', 'py-3', 'fade-in');
      output.style.backgroundColor = 'var(--color-bg-primary, #FFFFFF)';
    }

    // Update all buttons
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
      if (button.classList.contains('altBtn')) {
        // Answer buttons
        button.style.backgroundColor = 'var(--color-bg-primary, #FFFFFF)';
        button.style.color = 'var(--rich-black, #03071e)';
        button.style.borderRadius = '12px';
        button.style.padding = '16px';
        button.style.boxShadow = '0 2px 8px rgba(44, 62, 80, 0.04)';
        button.style.border = '1px solid var(--color-border-light, #ECF0F1)';
        button.style.fontFamily = 'var(--font-family-primary)';
        button.style.transition = 'all 0.25s cubic-bezier(0.4, 0.0, 0.2, 1)';
        button.classList.add('btn-press', 'stagger-item');
      } else if (button.classList.contains('navbtn')) {
        // Navigation buttons
        button.style.backgroundColor = 'var(--rosewood, #6a040f)';
        button.style.color = 'white';
        button.style.borderRadius = '12px';
        button.style.padding = '12px 24px';
        button.style.boxShadow = '0 2px 8px rgba(106, 4, 15, 0.3)';
        button.style.border = 'none';
        button.style.fontFamily = 'var(--font-family-primary)';
        button.style.fontWeight = '500';
        button.classList.add('btn-press');
      }
    });
    
    // Add subtle animation effects
    document.querySelectorAll('.card').forEach(card => {
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
        card.style.boxShadow = '0 6px 20px rgba(44, 62, 80, 0.12)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 16px rgba(44, 62, 80, 0.08)';
      });
    });

    // Add animation to any containers or divs
    const mainDivs = document.querySelectorAll('.main');
    mainDivs.forEach(div => {
      div.style.backgroundColor = 'var(--rosewood, #6a040f)';
      div.style.borderRadius = '12px';
      div.style.padding = '16px';
      div.style.boxShadow = '0 4px 16px rgba(106, 4, 15, 0.15)';
      div.classList.add('fade-in');
    });

    // Style any card elements
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.style.borderRadius = '16px';
      card.style.boxShadow = '0 4px 16px rgba(44, 62, 80, 0.08)';
      card.style.backgroundColor = 'var(--color-bg-primary, #FFFFFF)';
      card.style.border = '1px solid var(--color-border-light, #ECF0F1)';
      card.classList.add('fade-in');
    });

    // Style any input elements
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.style.borderRadius = '8px';
      input.style.border = '1px solid var(--tigers-eye, #bc6c25)';
      input.style.padding = '8px 12px';
      input.style.fontFamily = 'var(--font-family-primary)';
      input.style.fontSize = 'var(--font-size-body-medium, 0.9375rem)';
      input.style.color = 'var(--rich-black, #03071e)';
      input.classList.add('input-focus');
    });

    // Style specific elements
    const qCard = document.getElementById('qCard');
    if (qCard) {
      qCard.style.color = 'var(--rich-black, #03071e)';
      qCard.style.fontWeight = 'bold';
      qCard.style.textShadow = 'none';
    }

    const qText = document.getElementById('qText');
    if (qText) {
      qText.style.color = 'var(--rich-black, #03071e)';
    }

    // Ensure progress bars have proper colors
    const hangBar = document.getElementById('hangBar');
    if (hangBar) {
      // Color will be set dynamically, but ensure it has fallbacks
      hangBar.style.transition = 'width 0.6s ease, background-color 0.6s ease';
    }

    // Update modal styles for better contrast
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
      modalContent.style.backgroundColor = 'var(--color-bg-primary, #FFFFFF)';
      modalContent.style.color = 'var(--rich-black, #03071e)';
      modalContent.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.15)';
    }
  }, 100); // Small delay to ensure the main script has finished
});