import angular from 'angular';
import contactManagerApi from '../../services/contact-manager-api';

const MODULE_NAME = 'contactManager.contactsManage';

angular
  .module(MODULE_NAME, [
    contactManagerApi
  ])
  .controller('ContactsManageController', ContactsManageController);

ContactsManageController.$inject = ['$routeParams', '$location', '$q', 'contactManagerApi'];
function ContactsManageController($routeParams, $location, $q, contactManagerApi) {
  var contactsManage = this;
  contactsManage.isNew = isNew;
  contactsManage.submitForm = submitForm;
  contactsManage.contact = null;
  contactsManage.availableFaceIds = null;

  activate();

  //////////

  function activate() {
    return $q.all([
      _getAvailableFaceIds(),
      _getContact()
    ]);
  }

  function isNew() {
    return ($routeParams.id === 'new');
  }

  function submitForm() {
    _createOrUpdateContact(contactsManage.contact)
      .then(_goToContactsList);
  }

  function _getAvailableFaceIds() {
    return contactManagerApi
      .getAvailableFaceIds()
      .then(_onGetAvailableFaceIdsSuccess);
  }

  function _onGetAvailableFaceIdsSuccess(availableFaceIds) {
    contactsManage.availableFaceIds = availableFaceIds;
  }

  function _getContact() {
    if (isNew()) {
      contactsManage.contact = {};
    } else {
      return contactManagerApi
        .getContact($routeParams.id)
        .then(_onGetContactSuccess);
    }
  }

  function _onGetContactSuccess(contact) {
    contactsManage.contact = contact;
  }

  function _createOrUpdateContact(contact) {
    if (isNew()) {
      return contactManagerApi.createContact(contact);
    } else {
      return contactManagerApi.updateContact(contact);
    }
  }

  function _goToContactsList() {
    $location.path('contacts');
  }
}

export default MODULE_NAME;
