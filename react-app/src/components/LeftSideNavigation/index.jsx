import React, { useState } from 'react';
import { useHistory, NavLink } from "react-router-dom";
import { logout } from "../../store/session";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RiUserFollowFill } from "react-icons/ri";
import home from "../../nav-icons/home.png";
import settings from "../../nav-icons/settings.png";
import bolt from "../../nav-icons/bolt.png";
import chat from "../../nav-icons/chat.png";
import explore from "../../nav-icons/explore.png";
import mail from "../../nav-icons/mail.png";
import account from "../../nav-icons/account.png";
import "./index.css";
import { useNonClosingModal } from '../../context/NonClosingModal';
import LogOutModal from '../LogOutModal';
import { UserDetail } from '../UserDetail';
import { Message } from '../Message';

export function LeftSideNavigation() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const userInfo = useSelector(state => state.users.singleUser);
  const allUsers = useSelector(state => state.users.users);
  const [isOpen, setIsOpen] = useState(false);
  const [isArrowDirection, setIsArrowDirection] = useState('up');
  const [showMessage, setShowMessage] = useState(false);

  const { setModalContent } = useNonClosingModal();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    setIsOpen(!isOpen);
  };

  const accountDropdown = () => {
    setIsOpen(!isOpen);
    setIsArrowDirection(isArrowDirection === 'up' ? 'down' : 'up');
  }

  return (
    <div id='left-side-nav-container'>
      {user && (
        <div className="left-side-nav">
          <div className="left-side-nav-title">
            <h1 className="left-side-nav-title-hover">bumblr</h1>
          </div>
          <div className="left-side-nav-home" onClick={() => history.push("/")}>
            <img style={{ filter: 'brightness(0) invert(1)' }} src={home} alt="" /> Home
          </div>
          <div
            className="left-side-nav-coming-soon"
            onClick={() => alert("Feature coming soon!")}
          >
            <img style={{ filter: 'brightness(0) invert(1)' }} src={explore} alt="" /> Explore
          </div>
          {/* <div
          className="left-side-nav-coming-soon"
          onClick={() => alert("Feature coming soon!")}
        >
          <img style={{filter: 'brightness(0) invert(1)'}} src={video} alt="" /> <p>Live</p>
        </div> */}
          {/* <div
            className="left-side-nav-coming-soon"
            onClick={() => alert("Feature coming soon!")}
          >
            <img style={{ filter: 'brightness(0) invert(1)' }} src={bolt} alt="" /> <p>Activity</p>
          </div> */}
          <div
            className="left-side-nav-coming-soon"
            onClick={() => setShowMessage(!showMessage)}
          >
            <img style={{ filter: 'brightness(0) invert(1)' }} src={chat} alt="" /> <p>Messages</p>
          </div>
          <div className={`left-side-nav-messages${showMessage ? "" : " hidden"}`}>
            <Message />
          </div>
{/*           <div
            className="left-side-nav-coming-soon"
            onClick={() => alert("Feature coming soon!")}
          >
            <img style={{ filter: 'brightness(0) invert(1)' }} src={mail} alt="" /> <p>Inbox</p>
          </div> */}
          <div className="left-side-nav-account" onClick={accountDropdown}>
            <div className="left-side-nav-account-arrow-seperator">
              <img style={{ filter: 'brightness(0) invert(1)' }} src={account} alt="" /> <p>Account</p>
            </div>
            <i className={`nav-account-arrow ${isArrowDirection}`} />
          </div>
          {isOpen && (
            <div className='left-side-nav-drop-down'>
              <div className='dropdown-navlinks'>
                <div className='likes-info-container'>
                  <p style={{ color: 'white', margin: "0px", padding: "10px 0px" }}><i class="fa-solid fa-heart"></i>Likes</p>
                  <span><b>{userInfo.likes?.length}</b></span>
                </div>
                <NavLink to="/following" className='follow-info-container'>
                  <p style={{ color: 'white', margin: "0px" }}><RiUserFollowFill size={20} /><span>Following</span></p>
                  <span className='follow-counter'>{userInfo.userFollowing?.length}</span>
                </NavLink>
                <NavLink to="/follower" className='follow-info-container'>
                  <p style={{ color: 'white', margin: "0px" }}><i class="fa-solid fa-user-group"></i> <span>Followers</span></p>
                  <span className='follow-counter'>{userInfo.userFollowers?.length}</span>
                </NavLink>

                <NavLink
                  to="/settings"
                  className="left-side-nav-settings"
                >
                  <img style={{ filter: 'brightness(0) invert(1)' }} src={settings} alt="" /> <p>Settings</p>
                </NavLink>
                <p id='dropdown-logout' onClick={() => setModalContent(<LogOutModal />)}>Logout</p>
              </div>
              <div className="left-side-nav-account-user"
                onClick={(e) => {
                  e.stopPropagation()
                  setModalContent(<UserDetail user={allUsers[user.id]} />)
                }}
              >
                <img className="left-side-nav-current-user-pfp" src={user.profilePic} alt="avatar" />
                <div>
                  <div>{user.username}</div>
                  <div>{user.nickname}</div>
                </div>
              </div>
            </div>)}

          {/* <div
          className="left-side-nav-coming-soon"
          onClick={() => alert("Feature coming soon!")}
        >
          <img style={{filter: 'brightness(0) invert(1)'}} src={store} alt="" /> <p>BumblrMart</p>
        </div>
        <div
          className="left-side-nav-coming-soon"
          onClick={() => alert("Feature coming soon!")}
        >
          <img style={{filter: 'brightness(0) invert(1)'}} src={star} alt="" /> <p>Go Ad-Free</p>
        </div> */}
        </div>)}
    </div>
  );
}

export default LeftSideNavigation;
