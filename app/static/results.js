document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting in the default way
  
    var selectedCompetition = document.getElementById('competitionSelector').value;
  
    // Use the selectedCompetition value to navigate to the appropriate section on the page
    var targetSection = document.getElementById(selectedCompetition);
  
    if (targetSection) {
      window.location.hash = selectedCompetition; // Add the hash to the URL
      targetSection.scrollIntoView(); // Scroll to the selected competition
    }
  });
  