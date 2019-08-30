/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Flex, Box } from '@rebass/emotion';

const MigrationStatus = ({ planStatusCounts }) => {
  const { notStarted, inProgress, completed } = planStatusCounts;
  return (
    <React.Fragment>
      <dl className="pf-c-description-list pf-m-inline">
        <dt>
          <span className="pf-c-description-list__num">
            {notStarted.length}
          </span>
        </dt>
        <dd>
          Not started
        </dd>
        <dt>
          <span className="pf-c-description-list__num">
            {inProgress.length}
          </span>
        </dt>
        <dd>
          In progress
        </dd>
        <dt>
          <span className="pf-c-description-list__num">
            {completed.length}
          </span>
        </dt>
        <dd>
          Complete
        </dd>
      </dl>
    </React.Fragment>
  );
};
export default MigrationStatus;
