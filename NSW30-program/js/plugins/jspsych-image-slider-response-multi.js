/**
 * jspsych-image-slider-response-multi
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

// Modified by JL (2019)

jsPsych.plugins['image-slider-response-multi'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-slider-response-multi', 'stimulus_left', 'image');
  jsPsych.pluginAPI.registerPreload('image-slider-response-multi', 'stimulus_centre', 'image');
  jsPsych.pluginAPI.registerPreload('image-slider-response-multi', 'stimulus_right', 'image');

  plugin.info = {
    name: 'image-slider-response-multi',
    description: '',
    parameters: {
      stimulus_centre: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus Centre',
        default: undefined,
        description: 'The image content to be displayed in centre.'
      },
      stimulus_left: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus Left',
        default: undefined,
        description: 'The image content to be displayed on left.'
      },
      stimulus_right: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus Right',
        default: undefined,
        description: 'The image content to be displayed on right.'
      },
      rating_text1: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Text for first rating scale',
        default: undefined,
        description: 'Text for first rating scale.'
      },
      rating_text2: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Text for second rating scale',
        default: undefined,
        description: 'Text for second rating scale.'
      },
      rating_text3: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Text for third rating scale',
        default: undefined,
        description: 'Text for third rating scale.'
      },
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      start: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Slider starting value',
				default: 50,
				description: 'Sets the starting value of the slider',
			},
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider'
      },
      labels: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the slider.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var html = '';
    if (trial.prompt !== null){
      html += trial.prompt;
    }

    // stimuli
    // ----------------
    html += '<center>' +
    '<img id="jspsych-image-slider-response-multi-stimulus_left" class="jspsych-image-slider-response-multi-stimulus" src="'+trial.stimulus_left+'"></img>'+
    '<img id="jspsych-image-slider-response-multi-stimulus_centre" class="jspsych-image-slider-response-multi-stimulus" src="'+trial.stimulus_centre+'"></img>'+
    '<img id="jspsych-image-slider-response-multi-stimulus_right" class="jspsych-cimage-slider-response-multi-stimulus" src="'+trial.stimulus_right+'"></img>' +
    '<br>';

    // rating scale 1
    // ----------------
    html += trial.rating_text1;
    html += '<div id="jspsych-image-slider-response-multi-wrapper" style="margin: 100px 0px;"';
    html += '<div class="jspsych-image-slider-response-multi-container" style="position:relative;">';
    html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 50%;" id="jspsych-image-slider-response-multi-response1"></input>';
    html += '<div>'
    for(var j=0; j < trial.labels.length; j++){
      var width = 50/(trial.labels.length-1);
      var left_offset = 25 +(j * (50 /(trial.labels.length - 1))) - (width/2);
      html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
      html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
      html += '</div>'
    }
    html += '</div>';
    html += '</div>';
    html += '</div><br><br>';

    // rating scale 2
    // ------------------
    html += trial.rating_text2;
    html += '<div id="jspsych-image-slider-response-multi-wrapper" style="margin: 100px 0px;"';
    html += '<div class="jspsych-image-slider-response-multi-container" style="position:relative;">';
    html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 50%;" id="jspsych-image-slider-response-multi-response2"></input>';
    html += '<div>'
    for(var j=0; j < trial.labels.length; j++){
      var width = 50/(trial.labels.length-1);
      var left_offset = 25 +(j * (50 /(trial.labels.length - 1))) - (width/2);
      html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
      html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
      html += '</div>'
    }
    html += '</div>';
    html += '</div>';
    html += '</div><br><br>';

    // rating scale 3
    // ------------------
    html += trial.rating_text3;
    html += '<div id="jspsych-image-slider-response-multi-wrapper" style="margin: 100px 0px;"';
    html += '<div class="jspsych-image-slider-response-multi-container" style="position:relative;">';
    html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 50%;" id="jspsych-image-slider-response-multi-response2"></input>';
    html += '<div>'
    for(var j=0; j < trial.labels.length; j++){
      var width = 50/(trial.labels.length-1);
      var left_offset = 25 +(j * (50 /(trial.labels.length - 1))) - (width/2);
      html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
      html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
      html += '</div>'
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // submit button
    html += '<button id="jspsych-image-slider-response-multi-next" class="jspsych-btn">'+trial.button_label+'</button>';
    // ----------------
    html += '</center>';

    display_element.innerHTML = html;

    var response = {
      rt: null,
      response: null
    };

    display_element.querySelector('#jspsych-image-slider-response-multi-next').addEventListener('click', function() {
      // measure response time
      var endTime = (new Date()).getTime();
      response.rt = endTime - startTime;
      response.response1 = display_element.querySelector('#jspsych-image-slider-response-multi-response1').value;
      response.response2 = display_element.querySelector('#jspsych-image-slider-response-multi-response2').value;
      response.response3 = display_element.querySelector('#jspsych-image-slider-response-multi-response2').value;

      if(trial.response_ends_trial){
        end_trial();
      } else {
        display_element.querySelector('#jspsych-image-slider-response-multi-next').disabled = true;
      }

    });

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "response1": response.response1,
        "response2": response.response2,
        "response3": response.response3
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-slider-response-multi-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
