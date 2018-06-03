/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your incidents ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery'],
  function (oj, ko, $) {

    function IncidentsViewModel() {
      var self = this;

      self.value = ko.observable();
      self.value2 = ko.observable();
      self.value3 = ko.observable();

      self.sendmail=function(){
        alert ("Mail is sent successfully!");
      }

      self.checkPaidFor = ko.observableArray([{
        "Chat": { "paid": false },
        "Inbox": { "paid": false },
        "Skype": { "paid": false },
      }
      ]);

      self.Specialization = ko.observable();
      self.doctor_info = [{
        "Doctor_Name": "Dr. Ravishankar Reddy C.R",
        "Specialization": ["Neurologist"],
        "License_No": "123456",
        "clinic": ["Marvel Speciality Hospital"]
      },
      {
        "Doctor_Name": "Dr. Shipa Apte",
        "Specialization": ["Gynecologist"],
        "License_No": "112345",
        "clinic": ["Apollo Cradle Jayanagar", "Apollo Cradle Koramangala"]
      },
      {
        "Doctor_Name": "Dr. Priya Mani",
        "Specialization": ["Diabetologist"],
        "License_No": "112123",
        "clinic": ["Motherhood Hospital", "PriyaMani's Clinic", "MotherHood Clinic- Sai Speciality Center"]
      },
      {
        "Doctor_Name": "Dr. Tejas Suresh Rao",
        "Specialization": ["Internal Medicine"],
        "License_No": "1131123",
        "clinic": ["Punya Hospital", "Madhu Hospital", "healthcare@baswesvaranagar"]
      },
      {
        "Doctor_Name": "Dr.Sachin Kumar",
        "Specialization": ["Pulmonary Medicine"],
        "License_No": "1131134",
        "clinic": ["Punya Hospital", "Madhu Hospital", "healthcare@baswesvaranagar"]
      }
      ];

      self.specialistList = ko.observableArray();
      self.specializedDoctor = ko.observable("");
      self.getDoctors = function () {
        self.specialistList([]);
        for (var i = 0; i < self.doctor_info.length; i++) {
          if (self.doctor_info[i].Specialization[0] == self.Specialization()) {
            self.specialistList().push({ "value": self.doctor_info[i].Doctor_Name, "label": self.doctor_info[i].Doctor_Name });
          }
        };
        self.specialistList.valueHasMutated();
        // if (document.getElementById("docList") != undefined)
        //   document.getElementById("docList").refresh();
      }

      self.clinicList = ko.observableArray();
      self.getClinic = function () {
        self.clinicList([]);
        for (var i = 0; i < self.doctor_info.length; i++) {
          if (self.doctor_info[i].Doctor_Name == self.specializedDoctor()) {
            self.clinicList(self.doctor_info[i].clinic)
          }
        }
        self.clinicList.valueHasMutated();
      }

      self.proceedAndPay = ko.observable("proceedAndPay");
      self.doctorCharge = ko.observable("50");
      self.communicationType = ko.observable();
      self.modeOfCommunicationType = function () {
        switch (self.communicationType()) {
          case "Chat": {
            self.doctorCharge("50");
            if (self.checkPaidFor()[0].Chat.paid == false)
              self.proceedAndPay("proceedAndPay");
            break
          };
          case "Inbox": {
            self.doctorCharge("50");
            if (self.checkPaidFor()[0].Inbox.paid == false)
              self.proceedAndPay("proceedAndPay");
            break
          };
          case "Skype": {
            self.doctorCharge("70"); if (self.checkPaidFor()[0].Skype.paid == false)
              self.proceedAndPay("proceedAndPay");
            break
          };
          case "F2F": {
            self.doctorCharge("-- Please ask the consulting doctor for the same");
            self.proceedAndPay("proceed"); break
          };
          default: self.proceedAndPay("proceed");
        }
        self.doctorCharge.valueHasMutated();
      }


      self.doPayment = function () {
         self.showbot("none");
         self.showInbox("none");
        console.log("Came to do Payment");

        self.showPayment("showPayment");
        self.showPayment.valueHasMutated();
      };

      self.showInbox = ko.observable("none");

      self.proceed = function () {
        console.log("came to proceed");
        self.showInbox("none");
        self.showbot("none");
        self.showSkype("none");
        self.showPayment("consultDoctor");
        self.showPayment.valueHasMutated();
        if (self.communicationType() == "Chat") {
          self.showbot("block");
          self.showbot.valueHasMutated();
        }
        if (self.communicationType() == "Inbox") {
          self.showbot("none");
          self.showbot.valueHasMutated();
          self.showInbox("block");
          self.showInbox.valueHasMutated();
          self.showSkype("none");
        }
        if (self.communicationType() == "Skype") {
          self.showbot("none");
          self.showbot.valueHasMutated();
          self.showInbox("none");
          self.showInbox.valueHasMutated();
          self.showSkype("block");
        }
      }

      self.showPayment = ko.observable("consultDoctor");

      self.paymentSuccessful = function () {
         self.showbot("none");
         self.showInbox("none");
        self.checkPaidFor()[0][self.communicationType()].paid = true;
        self.checkPaidFor()[0][self.communicationType()].Doctor_Name = self.specializedDoctor();
        self.showPayment("paymentSuccess");
      }

      self.showbot = ko.observable("none");
      self.showHistory = function () {
        self.showInbox("none");
        self.showbot("none");
        self.showPayment("history");
      }

      self.showSkype = ko.observable("none");
      self.showConsultant = function () {
        self.showInbox("none");
        self.showbot("none");
        self.showPayment("consultDoctor");
      }
      /** bot js*/
      self.chatJSON = ko.observableArray();
      $.getJSON("js/data/chat.json", function (data) {
        self.chatJSON(data);
      });

      var me = {};
      me.avatar = "https://lh6.googleusercontent.com/-lr2nyjhhjXw/AAAAAAAAAAI/AAAAAAAARmE/MdtfUmC0M4s/photo.jpg?sz=48";

      var you = {};
      you.avatar = "https://a11.t26.net/taringa/avatares/9/1/2/F/7/8/Demon_King1/48x48_5C5.jpg";

      function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }

      //-- No use time. It is a javaScript effect.
      self.insertChat = function (who, text, time) {
        if (time === undefined) {
          time = 0;
        }
        var control = "";
        var date = formatAMPM(new Date());

        if (who == "me") {
          control = '<li style="width:100%">' +
            '<div class="msj macro">' +
            '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + me.avatar + '" /></div>' +
            '<div class="text text-l">' +
            '<p>' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '</div>' +
            '</li>';
        } else {
          control = '<li style="width:100%;">' +
            '<div class="msj-rta macro">' +
            '<div class="text text-r">' +
            '<p>' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + you.avatar + '" /></div>' +
            '</li>';
        }
        setTimeout(
          function () {
            $("ul").append(control).scrollTop($("ul").prop('scrollHeight'));
          }, time);

      }

      function resetChat() {
        $("ul").empty();
      }

      // self.enterPressed=function(e){
      //   console.log("Came Inside This");
      //   console.log(e.which);
      //     if (e.which == 13){
      //         var text = $(".mytext").val();
      //         if (text !== ""){
      //             self.insertChat("me", text);              
      //             $(this).val('');
      //         }
      //     }
      // };
      self.enterPressed = function (e) {
        var text = $(".mytext").val();
        if (text !== "") {
          self.insertChat("me", text);
          $(".mytext").val('');
        }
        if (self.chatJSON()[0][text] != undefined)
          self.insertChat("you", self.chatJSON()[0][text], 3000);
        else
          self.insertChat("you", "please specify more", 3000);
      }

      $('.botDiv > div > div > div:nth-child(2) > span').click(function () {
        $(".mytext").trigger({ type: 'keydown', which: 13, keyCode: 13 });
      })

      //-- Clear Chat
      resetChat();

      //-- Print Messages
      // self.insertChat("me", "Hello Tom...", 0);
      // self.insertChat("you", "Hi, Pablo", 1500);

      //-- NOTE: No use time on self.insertChat. 

    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new IncidentsViewModel();
  }
);
