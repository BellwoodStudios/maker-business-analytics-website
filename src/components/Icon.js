import React from 'react';
import PropTypes from 'prop-types';

/**
 * Thin wrapper around material icons. Supply a name that matches material icons name.
 */
function Icon ({ name, ...props }) {
    return (
        <i className="material-icons" {...props}>{name}</i>
    );
}

Icon.propTypes = {
    name: PropTypes.string.isRequired
};

export default Icon;