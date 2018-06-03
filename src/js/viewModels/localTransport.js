/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery'],
  function (oj, ko, $) {

    function DashboardViewModel() {
      var self = this;

      self.today = ko.observable();
      self.sourceBus=ko.observable();
      self.destBus=ko.observable();

      /** The following function is to calculate the date */
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      self.today(dd + '/' + mm + '/' + yyyy);

      self.BusACFareList=ko.observableArray([]);

      self.ACfares = function () {
        document.getElementById("myTableT").style.display = "block";

        if (self.sourceBus()=="Agra" && self.destBus()=="Jakasandra") {
          document.getElementById("myTd").innerHTML = "Rs 20";
          document.getElementById("myTd1").innerHTML = "Rs 20";
          document.getElementById("myTd2").innerHTML = "Rs 20";
        } else if (self.sourceBus() == "Agra" && self.destBus() == "Koramangala") {
          document.getElementById("myTd").innerHTML = " Rs 30";
          document.getElementById("myTd1").innerHTML = "Rs 30";
          document.getElementById("myTd2").innerHTML = "Rs 30";
        } else if (self.sourceBus() == "Agra" && self.destBus() == "WaterTank") {
          document.getElementById("myTd").innerHTML = "Rs 40";
          document.getElementById("myTd1").innerHTML = "Rs 40";
          document.getElementById("myTd2").innerHTML = "Rs 40";
        } else if (self.sourceBus() == "Jakasandra" && self.destBus() == "Koramangala") {
          document.getElementById("myTd").innerHTML = "Rs 10";
          document.getElementById("myTd1").innerHTML = "Rs 10";
          document.getElementById("myTd2").innerHTML = "Rs 10";
        } else if (self.sourceBus() == "Jakasandra" && self.destBus() == "WaterTank") {
          document.getElementById("myTd").innerHTML = "Rs 20";
          document.getElementById("myTd1").innerHTML = "Rs 20";
          document.getElementById("myTd2").innerHTML = "Rs 20";
        } else if (self.sourceBus() == "Koramangala" && self.destBus() == "WaterTank") {
          document.getElementById("myTd").innerHTML = "Rs 10";
          document.getElementById("myTd1").innerHTML = "Rs 10";
          document.getElementById("myTd2").innerHTML = "Rs 10";
        }
      }
      self.NonACfares=function() {
        document.getElementById("myTableT").style.display = "block";
        var x = document.getElementById("source").selectedIndex;
        var y = document.getElementById("destination").selectedIndex;
        if ((self.sourceBus() == "Agra") && (self.destBus() == "Jakasandra")) {
          document.getElementById("myTd").innerHTML = "Rs 15";
          document.getElementById("myTd1").innerHTML = "Rs 15";
          document.getElementById("myTd2").innerHTML = "Rs 15";
        } else if ((self.sourceBus() == "Agra") && (self.destBus() == "Koramangala")) {
          document.getElementById("myTd").innerHTML = " Rs 25";
          document.getElementById("myTd1").innerHTML = "Rs 25";
          document.getElementById("myTd2").innerHTML = "Rs 25";
        } else if ((self.sourceBus() == "Agra") && (self.destBus() == "WaterTank")) {
          document.getElementById("myTd").innerHTML = "Rs 35";
          document.getElementById("myTd1").innerHTML = "Rs 35";
          document.getElementById("myTd2").innerHTML = "Rs 35";
        } else if ((self.sourceBus() == "Jakasandra") && (self.destBus() == "Koramangala")) {
          document.getElementById("myTd").innerHTML = "Rs 5";
          document.getElementById("myTd1").innerHTML = "Rs 5";
          document.getElementById("myTd2").innerHTML = "Rs 5";
        } else if ((self.sourceBus() == "Jakasandra") && (self.destBus() == "WaterTank")) {
          document.getElementById("myTd").innerHTML = "Rs 15";
          document.getElementById("myTd1").innerHTML = "Rs 15";
          document.getElementById("myTd2").innerHTML = "Rs 15";
        } else if ((self.sourceBus() == "Koramangala") && (self.destBus() == "WaterTank")) {
          document.getElementById("myTd").innerHTML = "Rs 5";
          document.getElementById("myTd1").innerHTML = "Rs 5";
          document.getElementById("myTd2").innerHTML = "Rs 5";
        }
      }
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);
