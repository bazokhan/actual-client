/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import burgerFull from './images/burger-full.svg';
import burgerHalf from './images/burger-half.svg';
import CollapsableLink from './components/CollapsableLink';
import routes from './routes';

const SubMenu = ({ links, open, parent: { LinkIcon, text } }) => {
  const [closedVertically, setClosedVertically] = useState(true);
  return (
    <>
      <CollapsableLink
        type="button"
        onClick={() => setClosedVertically(!closedVertically)}
        hasOpenChildren={!closedVertically}
        openHorizontally={open}
        icon={LinkIcon}
        text={text}
      />
      {links.map(link => {
        return (
          <CollapsableLink
            key={link?.text}
            {...link}
            openHorizontally={open}
            closedVertically={closedVertically}
          />
        );
      })}
    </>
  );
};

SubMenu.propTypes = {
  links: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  parent: PropTypes.object.isRequired
};

const Sidebar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const pageNames = Object.keys(routes);
  const pageName = pageNames.find(name => pathname.includes(name));
  const pageLinks = pageName ? routes[pageName] : null;

  return (
    <nav className={cx(styles.container, `${open ? styles.open : ''}`)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cx(styles.bars, styles.basicButton)}
      >
        <img src={open ? burgerFull : burgerHalf} alt="menu" />
      </button>
      <div className={styles.linksContainer}>
        {pageLinks
          ? pageLinks?.map(link => {
              const { icon: LinkIcon, route, text, links } = link;
              if (links?.length) {
                return (
                  <SubMenu
                    links={links}
                    open={open}
                    parent={{ LinkIcon, route, text, links }}
                    key={text}
                  />
                );
              }
              return (
                <CollapsableLink
                  key={link?.text}
                  {...link}
                  openHorizontally={open}
                />
              );
            })
          : null}
      </div>
    </nav>
  );
};

Sidebar.propTypes = {
  pageLinks: PropTypes.array.isRequired
};

export default Sidebar;
