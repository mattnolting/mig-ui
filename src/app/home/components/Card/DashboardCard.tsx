/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { Component } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Title } from '@patternfly/react-core';
import theme from '../../../../theme';
import Loader from 'react-loader-spinner';
import CardStatus from './Status/CardStatus';
import MigrationStatus from './Status/MigrationStatus';
import FooterText from './FooterText';
import HeaderText from './HeaderText';
import { css } from '@emotion/core';
import { Flex, Box, Text } from '@rebass/emotion';
import StatusIcon from '../../../common/components/StatusIcon';

interface IState {
  isOpen: boolean;
}
interface IProps {
  title: string;
  dataList: any[];
  isFetching: boolean;
  type?: string;
  isError: boolean;
  planStatusCounts?: any;
  expandDetails?: (string) => void;
}

class DashboardCard extends Component<IProps, IState> {
  state = {
    isOpen: false,
  };

  onToggle = isOpen => {
    this.setState({
      isOpen,
    });
  };

  onSelect = event => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };
  render() {
    const { dataList, title, isFetching, type, isError, planStatusCounts, expandDetails } = this.props;
    const { isOpen } = this.state;
    if (isError) {
      return (
        <Card>
          <React.Fragment>
            <CardBody>
              <StatusIcon isReady={false} />
              Failed to fetch
            </CardBody>
          </React.Fragment>
        </Card>
      );
    }
    return (
      <Card className="pf-m-dashboard-card">
        {dataList && !isFetching ? (
          <React.Fragment>
            <CardHeader>
              <HeaderText type={type} dataList={dataList} />
            </CardHeader>
            <CardBody>
              {type === 'plans' ? (
                <MigrationStatus planStatusCounts={planStatusCounts} />
              ) : (
                  <CardStatus dataList={dataList} type={type} />
                )}
            </CardBody>
            <CardFooter>
              <FooterText dataList={dataList} type={type} expandDetails={expandDetails} />
            </CardFooter>
          </React.Fragment>
        ) : (
          <CardBody>
            <Loader type="ThreeDots" color={theme.colors.navy} height="100" width="100" />
            Loading
          </CardBody>
        )}
      </Card>
    );
  }
}

export default DashboardCard;
