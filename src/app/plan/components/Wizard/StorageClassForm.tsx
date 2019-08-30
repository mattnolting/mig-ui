/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { Box } from '@rebass/emotion';
import { Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import StorageClassTable from './StorageClassTable';
import styled from '@emotion/styled';
const StorageClassForm = props => {
  const { setFieldValue, values, currentPlan, clusterList, isFetchingPVList } = props;
  const StyledTextContent = styled(TextContent)`
    margin: 1em 0 1em 0;
  `;
  return (
    <React.Fragment>
      <Grid gutter="md">
        <GridItem>
          <TextContent>
            <Text component={TextVariants.p}>
              Select storage class for copied PVs:
            </Text>
          </TextContent>
        </GridItem>
        <GridItem>
          <StorageClassTable
            isFetchingPVList={isFetchingPVList}
            setFieldValue={setFieldValue}
            values={values}
            currentPlan={currentPlan}
            clusterList={clusterList}
          />
        </GridItem>
      </Grid>
    </React.Fragment>
  );
};
export default StorageClassForm;
