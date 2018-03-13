import React from 'react'
import { connect } from 'react-redux'
import PageWrapper from '../component/common/layout/PageWrapper.jsx'
import PageTitle from '../component/common/layout/PageTitle.jsx'
import PageContent from '../component/common/layout/PageContent.jsx'
import UserInfo from '../component/Account/UserInfo.jsx'
import MenuSubComponent from '../component/Account/MenuSubComponent.jsx'
import PersonalData from '../component/Account/PersonalData.jsx'
import Calendar from '../component/Account/Calendar.jsx'
import Notification from '../component/Account/Notification.jsx'
import { Delimiter } from 'tracim_lib'
import { updateUserWorkspaceSubscriptionNotif } from '../action-creator.sync.js'
import {
  getTimezone,
  getUserRole
} from '../action-creator.async.js'

class Account extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      subComponentMenu: [{
        name: 'personalData',
        menuLabel: 'Informations Compte',
        active: true
      }, {
        name: 'calendar',
        menuLabel: 'Calendrier',
        active: false
      }, {
        name: 'notification',
        menuLabel: 'Notifications',
        active: false
      }]
    }
  }

  componentDidMount () {
    const { user, workspaceList, timezone, dispatch } = this.props

    if (user.id !== -1 && workspaceList.length > 0) dispatch(getUserRole(user))
    if (timezone.length === 0) dispatch(getTimezone())
  }

  componentDidUpdate () {
    const { user, workspaceList, dispatch } = this.props
    if (user.id !== -1 && workspaceList.length > 0 && workspaceList.some(ws => ws.role === undefined)) dispatch(getUserRole(user))
  }

  handleClickSubComponentMenuItem = subMenuItemName => this.setState(prev => ({
    subComponentMenu: prev.subComponentMenu.map(m => ({...m, active: m.name === subMenuItemName}))
  }))

  handleChangeSubscriptionNotif = (workspaceId, subscriptionNotif) =>
    this.props.dispatch(updateUserWorkspaceSubscriptionNotif(workspaceId, subscriptionNotif))

  render () {
    const subComponent = (() => {
      switch (this.state.subComponentMenu.find(({active}) => active).name) {
        case 'personalData':
          return <PersonalData />

        case 'calendar':
          return <Calendar user={this.props.user} timezone={this.props.timezone} />

        case 'notification':
          return <Notification
            workspaceList={this.props.workspaceList}
            onChangeSubscriptionNotif={this.handleChangeSubscriptionNotif}
          />
      }
    })()

    return (
      <PageWrapper customClass='account'>
        <PageTitle
          parentClass={'account'}
          title={'Mon Compte'}
        />

        <PageContent parentClass='account'>
          <UserInfo user={this.props.user} />

          <Delimiter customClass={'account__delimiter'} />

          <div className='account__userpreference'>
            <MenuSubComponent subMenuList={this.state.subComponentMenu} onClickMenuItem={this.handleClickSubComponentMenuItem} />

            <div className='account__userpreference__setting'>
              { subComponent }
            </div>
          </div>

        </PageContent>
      </PageWrapper>
    )
  }
}

const mapStateToProps = ({ user, workspaceList, timezone }) => ({ user, workspaceList, timezone })
export default connect(mapStateToProps)(Account)