import React, { useContext } from 'react';
import { Flex, Box } from '@rebass/emotion';
import {
  Button,
  DataListItem,
  DataListCell,
  DataListItemCells,
  DataListItemRow,
  DataListAction,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle
} from '@patternfly/react-core';
import StatusIcon from '../../../../common/components/StatusIcon';
import AddEditStorageModal from '../../../../storage/components/AddEditStorageModal';
import { LinkIcon } from '@patternfly/react-icons';
import { useOpenModal } from '../../../duck/hooks';
import ConfirmModal from '../../../../common/components/ConfirmModal';
import { StorageContext } from '../../../duck/context';

const StorageItem = ({ storage, storageIndex, isLoading, removeStorage, ...props }) => {
  const associatedPlanCount = props.associatedPlans[storage.MigStorage.metadata.name];
  const planText = associatedPlanCount === 1 ? 'plan' : 'plans';
  const [isAddEditModalOpen, toggleIsAddEditModalOpen] = useOpenModal(false);
  const [isConfirmOpen, toggleConfirmOpen] = useOpenModal(false);
  const name = storage.MigStorage.metadata.name;
  const bucketName = storage.MigStorage.spec.backupStorageConfig.awsBucketName;
  const bucketRegion = storage.MigStorage.spec.backupStorageConfig.awsRegion;
  const s3Url = storage.MigStorage.spec.backupStorageConfig.awsS3Url;

  const accessKey =
    typeof storage.Secret === 'undefined'
      ? null
      : storage.Secret.data['aws-access-key-id']
      ? atob(storage.Secret.data['aws-access-key-id'])
      : '';
  const secret =
    typeof storage.Secret === 'undefined'
      ? null
      : storage.Secret.data['aws-secret-access-key']
      ? atob(storage.Secret.data['aws-secret-access-key'])
      : '';

  let storageStatus = null;
  if (storage.MigStorage.status) {
    storageStatus = storage.MigStorage.status.conditions.filter(c => c.type === 'Ready').length > 0;
  }
  const removeMessage = `Are you sure you want to remove "${name}"`;

  const handleRemoveStorage = isConfirmed => {
    if (isConfirmed) {
      removeStorage(name);
      toggleConfirmOpen();
    } else {
      toggleConfirmOpen();
    }
  };

  const storageContext = useContext(StorageContext);

  const editStorage = () => {
    storageContext.watchStorageAddEditStatus(name);
    toggleIsAddEditModalOpen();
  };

  this.state = { isOpen1: false, isOpen2: false, isOpen3: false };

  this.onToggle1 = isOpen1 => {
    this.setState({ isOpen1 });
  };

  this.onSelect1 = event => {
    this.setState(prevState => ({
      isOpen1: !prevState.isOpen1
    }));
  };

  this.onToggle2 = isOpen2 => {
    this.setState({ isOpen2 });
  };

  this.onSelect2 = event => {
    this.setState(prevState => ({
      isOpen2: !prevState.isOpen2
    }));
  };

  this.onToggle3 = isOpen3 => {
    this.setState({ isOpen3 });
  };

  this.onSelect3 = event => {
    this.setState(prevState => ({
      isOpen3: !prevState.isOpen3
    }));
  };

  return (
    <DataListItem key={storageIndex} aria-labelledby="">
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key={name} width={1}>
              <div className="pf-l-flex">
                <span className="pf-l-flex__item">
                  <StatusIcon isReady={storageStatus} />
                </span>
                <span className="pf-l-flex__item">
                  <span id="simple-item1">{name}</span>
                </span>
              </div>
            </DataListCell>,
            // this isnt rendering properly
            <DataListCell key="url" width={2}>
              <a target="_blank" href={storage.MigStorage.spec.bucketName}>
                {storage.MigStorage.spec.bucketName} Need to update this url
              </a>
            </DataListCell>,
            <DataListCell key="count" width={2}>
              <div className="pf-l-flex">
                <span className="pf-l-flex__item">
                  <LinkIcon />
                </span>
                <span className="pf-l-flex__item">
                  {associatedPlanCount} associated migration {planText}
                </span>
              </div>
            </DataListCell>
          ]}
        />
        {/* Need to update this section */}
        <DataListAction
          className="pf-m-hidden-on-lg"
          aria-labelledby="check-action-item2 check-action-action2"
          id="check-action-action2"
          aria-label="Actions"
        >
          <Dropdown
            isPlain
            position={DropdownPosition.right}
            isOpen={this.state.isOpen2}
            onSelect={this.onSelect2}
            toggle={<KebabToggle onToggle={this.onToggle2} />}
            dropdownItems={[
              <DropdownItem key="pri-action2" component="button">Primary</DropdownItem>,
              <DropdownItem key="sec-action2" component="button">Secondary</DropdownItem>,
            ]}
          />
        </DataListAction>
        <DataListAction
          // update this section
          className="pf-m-visible-on-lg pf-m-hidden"
          aria-labelledby="check-action-item2 check-action-action2"
          id={storageIndex}
          aria-label="Actions"
        >
          <Button onClick={editStorage} variant="secondary">
            Edit
          </Button>
          <AddEditStorageModal
            isOpen={isAddEditModalOpen}
            onHandleClose={toggleIsAddEditModalOpen}
            initialStorageValues={{
              name, bucketName, bucketRegion, accessKey, secret, s3Url,
            }}
          />
          <Button onClick={toggleConfirmOpen} variant="danger" key="remove-action">
            Remove
          </Button>
          <ConfirmModal
            message={removeMessage}
            isOpen={isConfirmOpen}
            onHandleClose={handleRemoveStorage}
            id="confirm-storage-removal"
          />
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  );
};
export default StorageItem;
