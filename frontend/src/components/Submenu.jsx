// styling
import styled from 'styled-components/macro';

// components
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// utils
import PropTypes from 'prop-types';

const StyledMenuItem = styled(MenuItem)`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.875rem !important;
  color: var(--text) !important;
  height: 40px;
  padding: 0 16px;
  width: 100%;
  
  &:hover .icon {
    color: var(--highlight);
  }

  .icon {
    color: var(--header);
    font-size: 12px;
    width: 12px;
    height: 12px;
    transition: color var(--transition);
  }
`;

const Submenu = ({open, onClose, anchorEl, actions}) => {

    return (
        <Menu
            open={open}
            onClose={onClose}
            anchorEl={anchorEl}
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            sx={{
                '& .MuiPaper-root': {
                    backgroundColor: 'var(--tooltip-bg)',
                    borderRadius: '4px',
                    boxShadow: 'var(--widget-shadow)',
                    marginTop: '6px',
                },
                '& .MuiMenu-list': {
                    padding: 0,
                },
                '& .MuiButtonBase-root': {
                    padding: '0 16px',
                    width: '100%',
                    '&:not(:last-child)': {
                        borderBottom: '1px solid var(--divider)'
                    },
                    '&:hover': {
                        backgroundColor: 'transparent'
                    }
                }
            }}
        >
            {
                actions.map((action, index) => (
                    <StyledMenuItem
                        key={index}
                        onClick={() => {
                            action.onClick && action.onClick();
                            onClose();
                        }}>
                        <i className={`icon icon-${action.icon}`}/>
                        {action.label}
                    </StyledMenuItem>
                ))
            }
        </Menu>
    )
}

Submenu.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    anchorEl: PropTypes.any,
    actions: PropTypes.array.isRequired
}

export default Submenu