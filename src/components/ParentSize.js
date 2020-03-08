import React from 'react';
import PropTypes from 'prop-types';
import { ParentSize as VsParentSize } from '@vx/responsive';

const ParentSize = ({ children }) => (
  <VsParentSize>
    {({ width, height }) =>
      width > 0 && height > 0 && children({ width, height })
    }
  </VsParentSize>
);

ParentSize.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ParentSize;
