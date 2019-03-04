import React from "react";
import { Form, Label, FormGroup, Input } from "reactstrap";
import * as challengeService from "../../services/challengeService";
import ContentWrapper from "../Layout/ContentWrapper";
import { Formik } from "formik";
import * as schemas from "../../models/challengeSchemas";
import * as notificationsMessage from "../NotificationMessage";
import * as activityService from "../../services/activityService";
import * as rewardService from "../../services/rewardService";

export default class Challenges extends React.Component {
  constructor(props) {
    super(props);
    this.validation = schemas.getChallengeSchema;

    this.state = {
      values: this.props.initialValues || {},
      touched: {},
      errors: {},
      activity: [],
      reward: [],
      unicNameError: "d-none",
      showErrorName: ""
    };
    this.state.challenge = this.validation.initialValues;
  }

  componentDidMount() {
    if (this.props.challengeInfo !== undefined) {
      challengeService
        .get(this.props.challengeInfo.id)
        .then(this.onGetChallengeSuccess)
        .catch(this.onGetChallengeError);
    }
    activityService
      .getAll()
      .then(this.onGetAllActivities)
      .catch(this.onGetChallengeError);
    console.log(this.props);
  }

  onGetChallengeError = response => {
    console.log("Error", response);
  };

  onGetChallengeSuccess = response => {
    if (response.item !== null) {
      this.setState({
        challenge: response.item
      });
    }
  };

  onGetAllActivities = activity => {
    this.setState(
      {
        activity: activity.items
      },
      () => this.rewardList()
    );
  };

  onFormSubmitted = (values, obj) => {
    if (this.props.challengeInfo !== undefined) {
      challengeService
        .update(this.props.challengeInfo.id, values)
        .then(this.onUpdateChallengeSuccess)
        .catch(this.onUpdateError);
    } else {
      challengeService
        .getByName(values.name)
        .then(r => {
          this.ongetByNameSuccess(values, obj, r);
        })
        .catch(r => {
          this.ongetByNameError(values, obj, r);
        });
    }
    // alert(JSON.stringify(values, null, 2));
  };
  ongetByNameSuccess = (values, obj, r) => {
    notificationsMessage.error({ message: "Name has Already taken!" });
    obj.setSubmitting(false);
    this.setState({ unicNameError: "", showErrorName: "error" });
  };
  ongetByNameError = (values, obj, r) => {
    challengeService
      .create(values)
      .then(this.onCreateChallengeSuccess)
      .catch(this.onCreateChallengeError)
      .then(() => {
        obj.setSubmitting(false);
      });
  };

  onCreateChallengeSuccess = () => {
    notificationsMessage.success({ message: "Create Succsessfull!" });
    this.props.history.push("/challenges/display");
  };
  onUpdateChallengeSuccess = () => {
    notificationsMessage.success({ message: "Update Succsessfull!" });
    // this.props.history.push("/challenges");
  };

  onCreateChallengeError = res => {
    notificationsMessage.error({ message: res });
    console.log(res);
  };

  removeChallengeRequest = () => {
    this.props.remove(this.props.challengeInfo);
  };

  rewardList = () => {
    rewardService
      .getAll()
      .then(this.onGetRewardsSuccess)
      .catch(this.onGetRewardsError);
  };

  onGetRewardsSuccess = reward => {
    this.setState({
      reward: reward.items
    });
  };

  activityTypeList = (activity, index) => {
    return (
      <option value={activity.id} key={index}>
        {" "}
        {activity.title}{" "}
      </option>
    );
  };
  rewardTypeList = (item, index) => {
    return (
      <option value={item.id} key={index}>
        {" "}
        {item.name || item.title}{" "}
      </option>
    );
  };
  hideError = () => {
    this.setState({ unicNameError: "d-none", showErrorName: "" });
  };

  render() {
    return (
      <ContentWrapper>
        <div className="d-flex content-heading ">Challenge Form</div>
        <Formik
          initialValues={this.state.challenge}
          onSubmit={this.onFormSubmitted}
          validationSchema={this.validation()}
          enableReinitialize={true}
        >
          {props => {
            const {
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            } = props;

            return (
              <Form onSubmit={handleSubmit} className="form-horizontal">
                <div className="modal-default">
                  <div className="modal-body" />
                  <fieldset>
                    <FormGroup className="row">
                      <Label className="col-xl-2 col-form-label" for="name">
                        Name
                      </Label>
                      <div className="col-xl-10">
                        <Input
                          value={values.name}
                          className={
                            errors.name && touched.name
                              ? "error"
                              : this.state.showErrorName
                          }
                          name="name"
                          type="text"
                          placeholder="Dale"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onClick={this.hideError}
                        />
                        {errors.name && touched.name && (
                          <label className="error">{errors.name}</label>
                        )}
                      </div>
                    </FormGroup>
                  </fieldset>
                  <fieldset>
                    <FormGroup className="row">
                      <Label
                        className="col-xl-2 col-form-label"
                        for="description"
                      >
                        Description
                      </Label>
                      <div className="col-xl-10">
                        <Input
                          className={
                            errors.description && touched.description
                              ? "error"
                              : ""
                          }
                          value={values.description}
                          name="description"
                          type="textarea"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.description && touched.description && (
                          <label className="error">{errors.description}</label>
                        )}
                      </div>
                    </FormGroup>
                  </fieldset>{" "}
                  <fieldset>
                    <FormGroup className="row">
                      <Label className="col-xl-2 col-form-label">Points</Label>
                      <div className="col-xl-10">
                        <Input
                          className={
                            errors.points && touched.points ? "error" : ""
                          }
                          value={values.points}
                          name="points"
                          type="number"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.points && touched.points && (
                          <label className="error">{errors.points}</label>
                        )}
                      </div>
                    </FormGroup>
                  </fieldset>
                  <fieldset>
                    <FormGroup className="row">
                      <Label className="col-xl-2 col-form-label">
                        Tier Type Id
                      </Label>

                      <div className="col-2">
                        <Label className="c-radio col-xl-2 col-form-label">
                          <label>
                            <input
                              className={
                                errors.tierTypeId && touched.tierTypeId
                                  ? "error"
                                  : ""
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="tierTypeId"
                              type="radio"
                              value="1"
                            />
                            {errors.tierTypeId && touched.tierTypeId && (
                              <label className="error">
                                {errors.tierTypeId}
                              </label>
                            )}
                            <span className="fa fa-circle" /> 1
                          </label>
                        </Label>
                      </div>
                      <div className="col-2">
                        <Label className="c-radio col-xl-2 col-form-label">
                          <label>
                            <input
                              className={
                                errors.tierTypeId && touched.tierTypeId
                                  ? "error"
                                  : ""
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                              name="tierTypeId"
                              type="radio"
                              value="2"
                            />
                            {errors.tierTypeId && touched.tierTypeId && (
                              <label className="error">
                                {errors.tierTypeId}
                              </label>
                            )}
                            <span className="fa fa-circle" /> 2
                          </label>
                        </Label>
                      </div>
                    </FormGroup>
                  </fieldset>
                  <fieldset>
                    <FormGroup className="row">
                      <Label className="col-xl-2 col-form-label">
                        Can Repeat
                      </Label>
                      <div className="col-md-10 checkbox c-checkbox">
                        <label>
                          <input
                            className={
                              errors.canRepeat && touched.canRepeat
                                ? "error"
                                : ""
                            }
                            name="canRepeat"
                            type="checkbox"
                            checked={values.canRepeat}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value=""
                          />
                          {errors.canRepeat && touched.canRepeat && (
                            <label className="error">{errors.canRepeat}</label>
                          )}
                          <span className="fa fa-check" />
                        </label>
                      </div>
                    </FormGroup>
                  </fieldset>
                  <fieldset>
                    <FormGroup className="row">
                      <div className="col">
                        <Label className="col-xl-2 col-form-label">
                          Date End
                        </Label>
                        <div className="input-group date" id="datetimepicker2">
                          <Input
                            className={
                              errors.dateEnd && touched.dateEnd ? "error" : ""
                            }
                            name="dateEnd"
                            type="date"
                            onChange={handleChange(values.dateEnd)}
                            onBlur={handleBlur}
                          />

                          <span className="input-group-append input-group-addon">
                            <span className="input-group-text far fa-calendar" />
                          </span>
                        </div>
                        <div className="col">
                          {errors.dateEnd && touched.dateEnd && (
                            <label className="error">{errors.dateEnd}</label>
                          )}
                        </div>
                      </div>

                      <div className="col">
                        <Label className="col-xl-2 col-form-label">
                          Date Start
                        </Label>
                        <div className="input-group date" id="datetimepicker2">
                          <Input
                            className={
                              errors.dateStart && touched.dateStart
                                ? "error"
                                : ""
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="dateStart"
                            type="date"
                            value={values.dateStart}
                          />

                          <span className="input-group-append input-group-addon">
                            <span className="input-group-text far fa-calendar" />
                          </span>
                        </div>
                        <div className="col">
                          {errors.dateStart && touched.dateStart && (
                            <label className="error">{errors.dateStart}</label>
                          )}
                        </div>
                      </div>
                    </FormGroup>
                  </fieldset>
                  <fieldset>
                    <FormGroup className="row">
                      <Label className="col-xl-2 col-form-label">
                        Is Active
                      </Label>
                      <div className="col-xl-10 checkbox c-checkbox">
                        <label>
                          <Input
                            className={
                              errors.isActive && touched.isActive ? "error" : ""
                            }
                            type="checkbox"
                            name="isActive"
                            onChange={handleChange}
                            checked={values.isActive}
                            value=""
                            onBlur={handleBlur}
                          />
                          {errors.isActive && touched.isActive && (
                            <label className="error">{errors.isActive}</label>
                          )}
                          <span className="fa fa-check" />
                        </label>
                      </div>
                    </FormGroup>
                  </fieldset>
                  <fieldset>
                    <FormGroup className="row">
                      <Label className="col-xl-2 col-form-label">
                        Activity Type
                      </Label>
                      <div className="col-xl-10">
                        <select
                          className={
                            errors.activityTypeId && touched.activityTypeId
                              ? "error form-control"
                              : "form-control"
                          }
                          type="number"
                          name="activityTypeId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.activityTypeId}
                        >
                          <option value="" label="Select type of activity" />
                          {this.state.activity.map(this.activityTypeList)}
                        </select>
                        {errors.activityTypeId && touched.activityTypeId && (
                          <label className="error">
                            {errors.activityTypeId}
                          </label>
                        )}
                      </div>
                    </FormGroup>
                  </fieldset>
                  <fieldset>
                    <FormGroup className="row">
                      <Label className="col-xl-2 col-form-label">Reward</Label>
                      <div className="col-xl-10">
                        <select
                          className={
                            errors.rewardId && touched.rewardId
                              ? "error form-control"
                              : "form-control"
                          }
                          type="number"
                          name="rewardId"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.rewardId}
                        >
                          {" "}
                          <option value="" label="Select type of activity" />
                          {this.state.reward.map(this.rewardTypeList)}
                        </select>
                        {errors.rewardId && touched.rewardId && (
                          <label className="error">{errors.rewardId}</label>
                        )}
                      </div>
                    </FormGroup>
                  </fieldset>
                  <h3 className={`text-danger ${this.state.unicNameError}`}>
                    The Name has Already taken!
                  </h3>
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-primary"
                    type="submit"
                    disabled={isSubmitting}
                    onClick={props.onSubmit}
                  >
                    Submit
                  </button>
                  <button
                    onClick={e => this.removeChallengeRequest(e)}
                    className="btn btn-sm btn-danger"
                    type="button"
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </ContentWrapper>
    );
  }
}
