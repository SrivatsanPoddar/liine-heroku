'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('liineApp',
  [ 'liineApp.controllers.header',
    'liineApp.controllers.live',
    'liineApp.controllers.IVR',
    'liineApp.controllers.competitor',
    'liineApp.config',
    'liineApp.directives.toFocus',
    'ngRoute','ngClipboard','ui.tree']
  );
