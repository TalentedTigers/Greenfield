const reducedToDay = date => date % 604800000 < 86400000;

const computeAvgWaitTime = (tickets, mentors, userId) => {
  const storage = [];
  let length = tickets.length;
  let count = 0;
  let sum = tickets.reduce((acc, curr) => {
    let date = Date.parse(curr.claimedAt);
    let wait = date - Date.parse(curr.createdAt);
    if (reducedToDay(date) && curr.claimedAt) { 
      storage.push(curr);
      return acc + wait; 
    } 
    return acc;
  }, 0);
  let queuePos = tickets.filter((ticket) => { return ticket.status === 'Opened'; }).sort((ticket1, ticket2) => Date.parse(ticket1.createdAt) - Date.parse(ticket2.createdAt)).findIndex((ticket) => ticket.userId === userId ) + 1;
  console.log('queuePos: ', queuePos);
  console.log('list of open tickets: ', tickets.filter((ticket) => { return ticket.status === 'Opened'; }).sort((ticket1, ticket2) => Date.parse(ticket1.createdAt) - Date.parse(ticket2.createdAt)));
  let quantityClaimedAndUnclosed = tickets.filter((ticket) => { return ticket.claimedAt && !ticket.closedAt; }).length;
  let openTickets = tickets.filter((ticket) => { return ticket.status === 'Opened'; });
  // keep this line for realtime data and delete line 21 with the hard code:
  // let excessMentors = mentors - quantityClaimedAndUnclosed;
  const excessMentors = 2;
  const estimatedInterval = new Date(sum / storage.length).getUTCMinutes();
  let estimate = 0;
  let countAvail = excessMentors;
  if (queuePos >= 0) {
    for (let i = 0; i < queuePos; i++) {
      if (i + 1 < countAvail && countAvail) {
        console.log('in the first conditional', estimatedInterval / (excessMentors * excessMentors));
        estimate += estimatedInterval / (excessMentors * excessMentors);
      } else {
        estimate += estimatedInterval / excessMentors/*optimized with all mentors on duty rather than excess*/;
      }
    }
  }
  
  return Math.floor(estimate);
};

const computeCurrWaitTime = (totalAveWait, gap, index) => {
  if (!gap) { return 0; }
  return (totalAveWait - gap) * index;
};

const adminStats = function(ticketArr) {
  var dashboardStats = {
    open: 0, 
    closed: 0,
    popularCategory: '', 
    popularCategoryCount: 0
  };
  var categories = {};
  for (var i = 0; i < ticketArr.length; i++) {
    if (Date.parse(ticketArr[i].dataValues.createdAt) > new Date() - 1 * 24 * 60 * 60 * 1000) {
      console.log('YOU ARE HERE!');    
      ticketArr[i].status === 'Closed' ? dashboardStats.closed++ : dashboardStats.open++;
      
      if (categories[ticketArr[i].category] !== undefined) {
        categories[ticketArr[i].category]++; 
      } else {
        categories[ticketArr[i].category] = 1;
      } 
      
      if (categories[ticketArr[i].category] > dashboardStats.popularCategoryCount) {
        dashboardStats.popularCategory = ticketArr[i].category;
        dashboardStats.popularCategoryCount = categories[ticketArr[i].category];
      }
    }
  }
  return dashboardStats;
};

module.exports = {
  computeAvgWaitTime: computeAvgWaitTime,
  computeCurrWaitTime: computeCurrWaitTime,
  adminStats: adminStats,
  computeAvgWaitTime: computeAvgWaitTime
};
