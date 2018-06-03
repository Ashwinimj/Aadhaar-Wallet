/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource',
  'ojs/ojoffcanvas', 'ojs/ojinputtext', 'ojs/ojlabel', 'ojs/ojdatetimepicker', 'ojs/ojinputnumber',
  'ojs/ojselectcombobox', 'ojs/ojtimezonedata', 'ojs/ojradioset', 'ojs/ojdialog'],
  function (oj, ko) {
    function ControllerViewModel() {
      var self = this;

      self.isLogin = ko.observable(false);
      self.authData = ko.observableArray();
      $.getJSON("js/data/Auth.json", function (data) {
        self.authData(data);
      });

      self.ScreenName = ko.observable("starting");
      self.userDetails = ko.observableArray();

      if (localStorage.getItem("userDetails") == undefined) {
        $.getJSON("js/data/userDetails.json", function (data) {
          self.userDetails(data);
          localStorage.setItem("userDetails", JSON.stringify(self.userDetails()));
        });
      } else {
        self.userDetails(JSON.parse(localStorage.getItem("userDetails")));
      }

      setTimeout(function () { self.ScreenName("login") }, 5000);

      /** Login Page Variables */
      self.usrname = ko.observable();
      self.pwd = ko.observable();

      /** New Registration Page Variables*/
      self.newUserDetail = ko.observable({
        "fullname": "",
        "gender": "",
        "email": "",
        "dob": oj.IntlConverterUtils.dateToLocalIso(new Date(1961, 1, 1)),
        "mobileNo": "",
        "aadhaarno": "",
        "isDoctor": "",
        "licenseNo": "",
        "specialization": "",
        "password": "",
        "confirmPwd": "",
        "specialization": "",
        "accountDetails": []
      });

      self.isDoctor = ko.observable();
      self.showError = ko.observable("none");
      self.banklist = ko.observableArray([]);
      self.newAccountNo = ko.observable();
      self.newAccounteeName = ko.observable();
      self.newIFSC = ko.observable();
      self.newAccountMobile = ko.observable();
      self.newBankName = ko.observable();
      self.insertOTP = ko.observable();
      self.otpInput = ko.observable("none");

      self.defaultBank = ko.observable();

      $('#mobileNo').keypress(function (event) { return eatNonNumbers(event); });
      $('#aadhaarno').keypress(function (event) { return eatNonNumbers(event); });

      /** The eatNonNumbers is defined to check the input field for non digits */
      function eatNonNumbers(event) {
        var charCode = (event.which) ? event.which : event.keyCode;
        var char = String.fromCharCode(charCode);
        // Only allow ".0123456789" (and non-display characters)
        var replacedValue = char.replace(/[^0-9]/g, '');
        if (char !== replacedValue && event.which != 0 && event.which != 8)
          return false;

        return true;
      }

      self.registerNow = function () {
        self.ScreenName("registerNow");
        self.ScreenName.valueHasMutated();
      }

      self.otpAccepted = function () {
        document.querySelector("#otpDialog").close();
        if (!insertNewDetailsInJSON()) {
          self.showError("aadhaarRegistered");
          self.showError.valueHasMutated();
          return true;
        }
        self.ScreenName("bankDetails");
        self.ScreenName.valueHasMutated();
      }
      self.otpDeclined = function () {
        document.querySelector("#otpDialog").close();
      }

      self.confirmAccount = function () {
        if (isEmptyValue(self.newAccounteeName()) || isEmptyValue(self.newBankName()) ||
          isEmptyValue(self.newIFSC()) || isEmptyValue(self.newAccountMobile()) ||
          isEmptyValue(self.newAccountNo())) {
          self.showError("fieldEmptyInBankDetail");
          self.showError.valueHasMutated();
          return true;
        }

        for (var i = 0; i < self.newUserDetail().accountDetails.length; i++) {
          if (self.newUserDetail().accountDetails[i] == (self.newBankName() + "-" + self.newAccountNo())) {
            self.showError("accountExists");
            self.showError.valueHasMutated();
            return true;
          }
        }
        self.otpInput("otpInput");
        return true;
      }

      self.confirmOTP = function () {
        if (self.insertOTP() != "9877") {
          self.showError("otpIncorrect");
          self.showError.valueHasMutated();
          return true;
        }
        self.newUserDetail().accountDetails.push(self.newBankName() + "-" + self.newAccountNo());

        self.banklist.push({ "value": self.newBankName() + "-" + self.newAccountNo(), "id": "b3" });
        self.banklist.valueHasMutated();
        self.newBankName(""); self.newAccountNo(""); self.newIFSC(""); self.newAccountMobile(); self.newAccounteeName();

        localStorage.setItem("userDetails", JSON.stringify(self.newUserDetail()));
        alert("Account Details added Successfully!");
      }

      self.resetPassword = function () {

      }

      self.goToBankDetails = function () {
        self.newUserDetail().isDoctor = self.isDoctor();
        if (isEmptyValue(self.newUserDetail().fullname) || isEmptyValue(self.newUserDetail().dob) ||
          isEmptyValue(self.newUserDetail().mobileNo) || isEmptyValue(self.newUserDetail().aadhaarno) ||
          isEmptyValue(self.newUserDetail().isDoctor) || isEmptyValue(self.newUserDetail().password) ||
          isEmptyValue(self.newUserDetail().confirmPwd)) {
          self.showError("fieldEmpty");
          self.showError.valueHasMutated();
          return true;
        }
        if (self.newUserDetail().isDoctor == "yes" || self.newUserDetail().isDoctor == "YES" ||
          self.newUserDetail().isDoctor == "Yes") {
          if (isEmptyValue(self.newUserDetail().licenseNo) || isEmptyValue(self.newUserDetail().specialization)) {
            self.showError("fieldEmpty");
            self.showError.valueHasMutated();
            return true;
          }
        }

        if (self.newUserDetail().password != self.newUserDetail().confirmPwd) {
          self.showError("pwdNotMatching");
          self.showError.valueHasMutated();
          return true;
        }

        if (!authorizedDetails()) {
          self.showError("dataNotMatching");
          self.showError.valueHasMutated();
          return true
        }

        document.querySelector("#otpDialog").open();
        return true;
      }

      self.goToLoginPage = function () {
        self.ScreenName("login");
        self.ScreenName.valueHasMutated();
        return true;
      }


      function getDefaultBank() {
        return document.querySelector('input[name="defaultBank"]:checked').value;
      }

      self.signIn = function (event) {
        var pwdElement = document.getElementById("pwd");
        var element = document.createElement("p");
        if (pwdElement.lastChild.nodeName == "P")
          pwdElement.replaceChild(document.createTextNode(""), pwdElement.lastChild);

        if (isEmptyValue(self.usrname()) || isEmptyValue(self.pwd())) {
          var node = document.createTextNode("*UserName/Password cannot be empty");
          element.appendChild(node);
          pwdElement.appendChild(element);
          pwdElement.style.color = "red";
          return true;
        } else {
          for (var i = 0; i < self.userDetails().length; i++) {
            if (self.userDetails()[i].aadhaarno == self.usrname()) {
              if (self.userDetails()[i].password == self.pwd()) {
                self.isLogin(true);
                self.ScreenName("HomePage");
                self.ScreenName.valueHasMutated();
                return true;
              } else {
                var node = document.createTextNode("*Password is Incorrect!");
                element.appendChild(node);
                pwdElement.appendChild(element);
                pwdElement.style.color = "red";;
                return true;
              }
            }
          };
        }

        var node = document.createTextNode("*Username is Incorrect!");
        element.appendChild(node);
        pwdElement.appendChild(element);
        pwdElement.style.color = "red";
        return true;
      }

      /** check if the field value is null or empty */
      function isEmptyValue(value) {
        if (value == "" || value == null)
          return true;
        return false;
      }

      /** Put the new registration detail to the json */
      function insertNewDetailsInJSON() {
        for (var i = 0; i < self.userDetails().length; i++) {
          if (self.userDetails()[i].aadhaarno == self.newUserDetail().aadhaarno)
            return false;
        }

        self.userDetails().push(self.newUserDetail());
        localStorage.setItem("userDetails", JSON.stringify(self.userDetails()));
        return true;
      }

      /** Validate the aadhaar detail */
      function authorizedDetails() {
        var temp = self.authData()[0][self.newUserDetail().aadhaarno].kyc_data;
        temp.date_of_birth = (temp.date_of_birth).split(/-/).reverse().join('-');
        if (self.newUserDetail().fullname == temp.name && self.newUserDetail().mobileNo &&
          temp.phone && self.newUserDetail().dob == temp.date_of_birth)
          return true;

        return false;
      }

      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      // Router setup
      self.router = oj.Router.rootInstance;
      self.router.configure({
        'homePage': { label: 'Home Page', isDefault: true },
        'localTransport': { label: 'Local Transport' },
        'medicalRecords': { label: 'Medical Record & Consultation' },
        'transferMoney': { label: 'Transfer Money' },
        'Inbox': { label: 'Inbox' },
        'settings': { label: 'Settings' }
      });
      oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

      // Navigation setup
      var navData = [
        {
          name: 'Home Page', id: 'homePage',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
        },
        {
          name: 'Local Transport', id: 'localTransport',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
        },
        {
          name: 'Medical Record & Consultation', id: 'medicalRecords',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'
        },
        {
          name: 'Transfer Money', id: 'transferMoney',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'
        },
        {
          name: 'Settings', id: 'settings',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'
        },
        {
          name: 'Inbox', id: 'Inbox',
          iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'
        }
      ];
      self.navDataSource = new oj.ArrayTableDataSource(navData, { idAttribute: 'id' });

      // Drawer
      // Close offcanvas on medium and larger screens
      self.mdScreen.subscribe(function () { oj.OffcanvasUtils.close(self.drawerParams); });
      self.drawerParams = {
        displayMode: 'push',
        selector: '#navDrawer',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      self.toggleDrawer = function () {
        return oj.OffcanvasUtils.toggle(self.drawerParams);
      }
      // Add a close listener so we can move focus back to the toggle button when the drawer closes
      $("#navDrawer").on("ojclose", function () { $('#drawerToggleButton').focus(); });

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("App");
      // User Info used in Global Navigation area
      self.userLogin = ko.observable();
      self.userLogin(self.usrname());


    }

    return new ControllerViewModel();
  }
);
