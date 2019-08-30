/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';
import {
  Button,
  TextInput,
  Form,
  FormGroup,
  Tooltip,
  TooltipPosition,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon, DivideIcon } from '@patternfly/react-icons';
import { withFormik, FormikProps } from 'formik';
import KeyDisplayIcon from '../../../common/components/KeyDisplayIcon';
import FormErrorDiv from '../../../common/components/FormErrorDiv';
import HideWrapper from '../../../common/components/HideWrapper';
import utils from '../../../common/duck/utils';
import { Flex, Box, Text } from '@rebass/emotion';
import {
  AddEditMode,
  addEditStatusText,
  addEditButtonText,
  isAddEditButtonDisabled,
  isCheckConnectionButtonDisabled,
} from '../../../common/add_edit_state';
import ConnectionStatusLabel from '../../../common/components/ConnectionStatusLabel';

const nameKey = 'name';
const urlKey = 'url';
const tokenKey = 'token';

const componentTypeStr = 'cluster';
const currentStatusFn = addEditStatusText(componentTypeStr);
const addEditButtonTextFn = addEditButtonText(componentTypeStr);

// valuesHaveUpdate - returns true if the formik values hold values that differ
// from a matching existing cluster. This is different from props.dirty, which returns
// true when the form values differ from the initial values. It's possible to have
// a cluster object exist, but have no initial values (user adds new cluster, then updates
// while keeping the modal open). props.dirty is not sufficient for this case.
const valuesHaveUpdate = (values, currentCluster) => {
  if (!currentCluster) { return true; }

  const rawToken = atob(currentCluster.Secret.data.saToken);
  const existingEndpoint =
    currentCluster.Cluster.spec.kubernetesApiEndpoints.serverEndpoints[0].serverAddress;
  return values.name !== currentCluster.MigCluster.metadata.name ||
    values.url !== existingEndpoint ||
    values.token !== rawToken;
};
const InnerAddEditClusterForm = (props: IOtherProps & FormikProps<IFormValues>) => {
  const {
    addEditStatus: currentStatus,
    currentCluster,
    checkConnection,
    values,
    touched,
    errors,
    handleSubmit,
    handleChange,
    setFieldTouched,
    handleBlur,
    onClose,
  } = props;

  const [isTokenHidden, setIsTokenHidden] = useState(true);
  const toggleHideToken = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsTokenHidden(!isTokenHidden);
  };
  const formikHandleChange = (_val, e) => handleChange(e);
  const formikSetFieldTouched = key => () => setFieldTouched(key, true, true);

  return (
    <Form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
      <FormGroup label="Cluster Name" isRequired fieldId={nameKey}>
        <TextInput
          onChange={formikHandleChange}
          onInput={formikSetFieldTouched(nameKey)}
          onBlur={handleBlur}
          value={values.name}
          name={nameKey}
          type="text"
          id="cluster-name-input"
          isDisabled={currentStatus.mode === AddEditMode.Edit}
        />
        {errors.name && touched.name && (
          <FormErrorDiv id="feedback-name">{errors.name}</FormErrorDiv>
        )}
      </FormGroup>
      <FormGroup label="Url" isRequired fieldId={urlKey}>
        <TextInput
          onChange={formikHandleChange}
          onInput={formikSetFieldTouched(urlKey)}
          onBlur={handleBlur}
          value={values.url}
          name={urlKey}
          type="text"
          id="url-input"
        />
        {errors.url && touched.url && <FormErrorDiv id="feedback-url">{errors.url}</FormErrorDiv>}
      </FormGroup>
      <FormGroup label="Service account token" isRequired fieldId={tokenKey}>
        <HideWrapper onClick={toggleHideToken}>
          <KeyDisplayIcon id="accessKeyIcon" isHidden={isTokenHidden} />
        </HideWrapper>
        <TextInput
          value={values.token}
          onChange={formikHandleChange}
          onInput={formikSetFieldTouched(tokenKey)}
          onBlur={handleBlur}
          name={tokenKey}
          id="token-input"
          type={isTokenHidden ? 'password' : 'text'}
        />
        {errors.token && touched.token && (
          <FormErrorDiv id="feedback-token">{errors.token}</FormErrorDiv>
        )}
      </FormGroup>
      <div className="pf-l-flex pf-m-column">
        <div className="pf-l-flex">
          <div className="pf-l-flex__item">
            <Button
              type="submit"
              isDisabled={isAddEditButtonDisabled(
                currentStatus, errors, touched, valuesHaveUpdate(values, currentCluster)
              )}
            >
              {addEditButtonTextFn(currentStatus)}
            </Button>
          </div>
          <div className="pf-l-flex__item">
            <Tooltip
              position={TooltipPosition.top}
              content={<div>
                Add or edit your cluster details
              </div>}><OutlinedQuestionCircleIcon />
            </Tooltip>
          </div>
          <div className="pf-l-flex__item">
            <Button
              isDisabled={isCheckConnectionButtonDisabled(
                currentStatus, valuesHaveUpdate(values, currentCluster),
              )}
              onClick={() => checkConnection(values.name)}
            >
              Check connection
            </Button>
          </div>
          <div className="pf-l-flex__item">
            <Tooltip
              position={TooltipPosition.top}
              content={<div>
                Re-check your cluster's connection state
              </div>}><OutlinedQuestionCircleIcon />
            </Tooltip>
          </div>
        </div>
        <div className="pf-l-flex__item">
          <ConnectionStatusLabel
              status={currentStatus}
              statusText={currentStatusFn(currentStatus)}
            />
        </div>
        <div className="pf-l-flex__item">
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
      {/* <Flex flexDirection="column">
        <Box m="0 0 1em 0 ">
          <Button
            type="submit"
            isDisabled={isAddEditButtonDisabled(
              currentStatus, errors, touched, valuesHaveUpdate(values, currentCluster)
            )}
            style={{ marginRight: '10px' }}
          >
            {addEditButtonTextFn(currentStatus)}
          </Button>
          <Tooltip
            position={TooltipPosition.top}
            content={<div>
              Add or edit your cluster details
            </div>}><OutlinedQuestionCircleIcon />
          </Tooltip>
          <Button
            style={{ marginLeft: '10px', marginRight: '10px' }}
            isDisabled={isCheckConnectionButtonDisabled(
              currentStatus, valuesHaveUpdate(values, currentCluster),
            )}
            onClick={() => checkConnection(values.name)}
          >
            Check connection
          </Button>
          <Tooltip
            position={TooltipPosition.top}
            content={<div>
              Re-check your cluster's connection state
            </div>}><OutlinedQuestionCircleIcon />
          </Tooltip>
        </Box>
        <Box m="0 0 1em 0 ">
          <ConnectionStatusLabel
            status={currentStatus}
            statusText={currentStatusFn(currentStatus)}
          />
        </Box>
        <Box m="auto 0 0 0 ">
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Flex> */}
    </Form>
  );
};
interface IFormValues {
  name: string;
  url: string;
  token: string;
}
interface IOtherProps {
  onAddEditSubmit: any;
  onClose: any;
  addEditStatus: any;
  currentCluster: any;
  checkConnection: (name) => void;
}

const AddEditClusterForm: any = withFormik({
  mapPropsToValues: ({ initialClusterValues }) => {
    const values = {
      name: '',
      url: '',
      token: '',
    };

    if (initialClusterValues) {
      values.name = initialClusterValues.clusterName || '';
      values.url = initialClusterValues.clusterUrl || '';
      values.token = initialClusterValues.clusterSvcToken || '';
    }

    return values;
  },

  validate: (values: any) => {
    const errors: any = {};

    if (!values.name) {
      errors.name = 'Required';
    } else if (!utils.testDNS1123(values.name)) {
      errors.name = utils.DNS1123Error(values.name);
    }

    if (!values.url) {
      errors.url = 'Required';
    } else if (!utils.testURL(values.url)) {
      errors.url = 'Not a valid URL';
    }

    if (!values.token) {
      errors.token = 'Required';
    }

    return errors;
  },

  handleSubmit: (values, formikBag: any) => {
    // Formik will set isSubmitting to true, so we need to flip this back off
    formikBag.setSubmitting(false);
    formikBag.props.onAddEditSubmit(values);
  },
})(InnerAddEditClusterForm);

export default AddEditClusterForm;
