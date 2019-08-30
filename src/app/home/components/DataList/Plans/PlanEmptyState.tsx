import React from 'react';
import { useOpenModal } from '../../../duck/hooks';
import WizardContainer from '../../../../plan/components/Wizard/WizardContainer';
import { Flex, Box } from '@rebass/emotion';
import { Button, Title, EmptyState, EmptyStateIcon } from '@patternfly/react-core';
import { AddCircleOIcon } from '@patternfly/react-icons';

const PlanEmptyState = ({ toggleOpen, plansDisabled }) => {
  return (
    <EmptyState variant="full">
      <EmptyStateIcon icon={AddCircleOIcon} />
      <Title size="lg">No currently started plans</Title>
      <Button isDisabled={plansDisabled} onClick={toggleOpen} variant="primary">
        Add plan
      </Button>
    </EmptyState>
  );
};

export default PlanEmptyState;
