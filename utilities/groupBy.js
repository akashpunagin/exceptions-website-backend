function groupBy(arrayOfObj, property) {
  const grouped = arrayOfObj.reduce((eventTeamMember, item) => {
    const group = eventTeamMember[item[property]] || [];
    group.push(item);
    eventTeamMember[item[property]] = group;
    return eventTeamMember;
  }, {});

  return grouped;
}

module.exports = { groupBy };
