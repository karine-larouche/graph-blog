import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';

const Skeletonnable = ({ isSkeleton, animation, children }) =>
  isSkeleton ? <Skeleton animation={animation}>{children}</Skeleton> : children;

Skeletonnable.propTypes = {
  isSkeleton: PropTypes.bool.isRequired,
  animation: PropTypes.bool,
  children: PropTypes.node,
};

Skeletonnable.defaultProps = {
  animation: undefined,
  children: null,
};

export default Skeletonnable;
