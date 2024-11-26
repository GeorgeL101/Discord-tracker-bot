const getRankFromWins = (wins) => {
    if (wins >= 50) {
      return 'Legend';
    } else if (wins >= 20) {
      return 'Master';
    } else if (wins >= 10) {
      return 'Gold';
    } else if (wins >= 5) {
      return 'Silver';
    } else {
      return 'Bronze';
    }
  };
  
  module.exports = { getRankFromWins };
  