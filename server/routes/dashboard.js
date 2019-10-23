const randomColor = require('randomcolor')

const ACTIVITY_TABLE = require('../utils/activities')

const IMPORTANT_ACTIVITY_TYPE = _.chain(ACTIVITY_TABLE)
  .pickBy(define => define.emphasis >= 3)
  .keys()
  .value()

const GROUP_TYPE_LABELS = { ORGANIZATION: '机构', DEPARTMENT: '部门', PROJECT: '项目', BRANCH: '分支机构' }

const USER_ROLE_LABELS = {
  'user-admin': '用户管理员',
  'content-admin': '内容管理员',
  'client-manager': '客户经理',
  'legal-agent': '法务',
  'client-operator': '客户操作员',
  lawyer: '律师',
  'asst-lawyer': '助理律师',
  undefined: 'BUG',
  support: '律所行政',
  guest: '访客',
  root: '根组织机构虚拟用户',
}
const ISSUE_ISOPEN_LABELS = {
  true: '进行中',
  false: '已完成',
}

module.exports = function ({ router }) {

  return router

    .get('/screen3', async function (req, res, next) {
      const activities = await db.activities.find().toArray()
      test = _.chain(activities)
        .filter(({ type }) => type === 'USER_LOGIN')
        .groupBy(activity => {
          return moment(activity.createdAt).format('H')
        })
        .mapValues(_.size)
        .value()

      test1 = _.chain(activities)
        .filter(({ type }) => type === 'SEND_MESSAGE')
        .groupBy(activity => {
          return moment(activity.createdAt).format('H')
        })
        .mapValues(_.size)
        .value()

      return res.json({})
    })

    .get('/screen2', async function (req, res, next) {
      const issues = await db.issues.find({ groupId: { $exists: true }, isDeleted: { $ne: true } }).toArray()
      const issuesGroupByGroupId = _.chain(issues)
        .groupBy('groupId')
        .mapValues(_.size)
        .value()

      const activities = await db.activities.find({ groupId: { $exists: true }, isDeleted: { $ne: true } }).toArray()
      const activitiesGroupByGroupId = _.chain(activities)
        .groupBy('groupId')
        .mapValues(_.size)
        .value()

      const groups = await db.groups.find({ level: { $lte: 3 }, isDeleted: { $ne: true } }).toArray()
      const groupsGroupById = _.chain(groups)
        .map(value => {
          if (value.level === 1) {
            value.color = randomColor({
              luminosity: 'dark',
            })
          }
          return value
        })
        .keyBy('_id')
        .value()

      const groupsTreemap = _.chain(groups)
        .map(group => ({
          id: group._id,
          parent: group.parentGroupId,
          name: groupsGroupById[group._id]['name'],
          color: groupsGroupById[group._id]['color'],
          value: _.get(activitiesGroupByGroupId, `${group._id}`, 0) + _.get(issuesGroupByGroupId, `${group._id}`, 0),
        }))

      const result = {
        groupsTreemap
      }

      return res.json({ result })
    })

    .get('/dashboard', async function (req, res, next) {
      const groups = await db.groups.find({ isDeleted: { $ne: true } }).toArray()
      const groupsKeyById = _.keyBy(groups, '_id')

      const users = await db.users.find({ isDeleted: { $ne: true } }).toArray()
      const usersKeyById = _.keyBy(users, '_id')

      const issues = await db.issues.find({ isDeleted: { $ne: true } }, { sort: { createdAt: 1 } }).toArray()
      const issuesKeyById = _.keyBy(issues, '_id')

      const activitiesQuery = { isDeleted: { $ne: true }, type: { $in: IMPORTANT_ACTIVITY_TYPE } }
      const activitiesQueryOptions = { sort: { createdAt: 1 } }
      const activities = await db.activities.find(activitiesQuery, activitiesQueryOptions).toArray()

      const issuemembers = await db.issuemembers.find({ isDeleted: { $ne: true } }).toArray()
      const issuemembersKeyByIssueId = _.keyBy(issuemembers, 'issueId')

      const countGroupsByType = _.chain(groups)
        .groupBy('type')
        .mapValues(_.size)
        .mapKeys((v, k) => GROUP_TYPE_LABELS[k])
        .value()

      const countUsersByType = _.chain(users)
        .groupBy('role')
        .mapValues(_.size)
        .mapKeys((v, k) => USER_ROLE_LABELS[k])
        .pick(['客户经理', '法务', '客户操作员', '律师', '助理律师', '律所行政', '访客', '根组织机构虚拟用户'])
        .value()

      const countIssuesByIsOpen = _.chain(issues)
        .groupBy('isOpen')
        .mapValues(_.size)
        .mapKeys((v, k) => ISSUE_ISOPEN_LABELS[k])
        .value()

      const countActivitiesByType = _.chain(activities)
        .groupBy('type')
        .mapValues(_.size)
        // .mapKeys((v, k) => ISSUE_ISOPEN_LABELS[k])
        .value()

      countGroupsByType.total = groups.length
      countUsersByType.total = _.chain(countUsersByType).values().sum().value()
      countIssuesByIsOpen.total = _.chain(countIssuesByIsOpen).values().sum().value()
      countActivitiesByType.total = _.chain(countActivitiesByType).values().sum().value()

      const startOfYearForIssues = moment(issues[0].createdAt).startOf('year').toDate()
      const currentStartOfYearForIssues = moment().startOf('year').toDate()
      const startOfMonthForIssues = moment().subtract(1, 'months').startOf('month').toDate()
      const endOfMonthForIssues = moment().endOf('month').toDate()

      const issuesSumByCurrentMonth = _.chain(issues)
        .filter(compareDate(startOfMonthForIssues, endOfMonthForIssues))
        .groupBy(groupByCreatedAt)
        .mapValues(_.size)
        // .map((y, name) => ({ name, y }))
        .toPairs()
        .value()

      const issuesSumByCurrentYear = _.chain(issues)
        .filter(compareDate(currentStartOfYearForIssues, new Date()))
        .groupBy(groupByCreatedAtOnMonth)
        .mapValues(_.size)
        // .map((y, name) => ({ name, y }))
        .mapKeys((value, key) => key + '月')
        .toPairs()
        .value()

      const issuesSumByYears = _.chain(issues)
        .groupBy(groupByCreatedAtOnYear)
        .mapValues(_.size)
        // .map((y, name) => ({ name, y }))
        .mapKeys((value, key) => key + '年')
        .toPairs()
        .value()

      const issuesCountByGroupId = _.chain(issues)
        .countBy('groupId')
        .map((value, name) => ({ name: _.get(groupsKeyById, `${name}.name`), value }))
        .orderBy(['value'], ['desc'])
        .take(10)
        .value()

      // for activities

      const startOfMonthForActivities = moment().subtract(7, 'days').toDate()
      const endOfMonthForActivities = moment().toDate()

      const activitiesSumByLatest7Days = _.chain(activities)
        .filter(compareDate(startOfMonthForActivities, endOfMonthForActivities))
        .groupBy(groupByCreatedAt)
        .mapValues(_.size)
        .toPairs()
        .value()

      const activitiesGroupByType = _.chain(activities)
        .groupBy('type')
        .mapValues(_.size)
        .map((v, k) => ({ k: ACTIVITY_TABLE[k]['name'], v }))
        .orderBy(['v'], ['desc'])
        .take(6)
        .value()

      const issuesCountByUsers = _.chain(issues)
        .countBy('createdById')
        .map((value, name) => ({ name: _.get(usersKeyById, `${name}.profile.name`), value }))
        .orderBy(['value'], ['desc'])
        .take(10)
        .value()

      const top10Issues = _.chain(activities)
        .filter(isIssueIdExist)
        .groupBy('issueId')
        .mapValues(_.size)
        .map((value, name) => ({ name, value }))
        .orderBy(['value'], ['desc'])
        .take(10)
        .map(value => {
          value.name = issuesKeyById[value.name]['title']
          return value
        })
        .value()

      const result = {
        countGroupsByType,
        countUsersByType,
        countIssuesByIsOpen,
        countActivitiesByType,

        issuesSumByCurrentMonth,
        issuesSumByCurrentYear,
        issuesSumByYears,
        issuesCountByGroupId,

        activitiesSumByLatest7Days,
        activitiesGroupByType,

        issuesCountByUsers,

        top10Issues,
      }

      return res.json({ result })
    })

}

function compareDate(startOfMonth, endOfMonth) {
  return function (issue) {
    const date = moment(issue.createdAt).toDate()
    return (date >= startOfMonth) && (date <= endOfMonth)
  }
}

function groupByCreatedAt({ createdAt }) {
  return moment(createdAt).format('M.D')
}

function groupByCreatedAtOnYear({ createdAt }) {
  return moment(createdAt).format('YYYY')
}

function groupByCreatedAtOnMonth({ createdAt }) {
  return moment(createdAt).format('M')
}

function isIssueIdExist(activity) {
  return activity.issueId
}
