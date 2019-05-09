/**
 * jspsych-image-causation-slider-response
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

 // Modified by JL (2019)

jsPsych.plugins['image-causation-slider-response'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-causation-slider-response', 'stimulus_left', 'image');
  jsPsych.pluginAPI.registerPreload('image-causation-slider-response', 'stimulus_centre', 'image');
  jsPsych.pluginAPI.registerPreload('image-causation-slider-response', 'stimulus_right', 'image');

  plugin.info = {
    name: 'image-causation-slider-response',
    description: '',
    parameters: {
      trial_type: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Trial Type',
        default: null,
        description: 'Trial type.'
      },
      trial_code: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Trial Code',
        default: null,
        description: 'Trial code.'
      },
      cover_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Cover Text',
        default: null,
        description: 'The text to be displayed at the top of the screen.'
      },
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

    var html = '<center><div id="jspsych-image-causation-slider-response-wrapper" style="margin: 100px 0px;">';

    if (trial.cover_text !== null) {
      html += trial.cover_text;
    }

    // stimuli
    html += '<center>' +
    '<img id="jspsych-image-causation-slider-response-multi2-stimulus_left" class="jspsych-image-causation-slider-response-multi2-stimulus" src="'+trial.stimulus_left+'"></img>'+
    '<img id="jspsych-image-causation-slider-response-multi2-stimulus_centre" class="jspsych-image-causation-slider-response-multi2-stimulus" src="'+trial.stimulus_centre+'"></img>'+
    '<img id="jspsych-image-causation-slider-response-multi2-stimulus_right" class="jspsych-cimage-causation-slider-response-multi2-stimulus" src="'+trial.stimulus_right+'"></img>';

    // prompt
    if (trial.prompt !== null){
      html += trial.prompt;
    }

    // slider
    html += '<div class="jspsych-image-causation-slider-response-container" style="position:relative;">';
    html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 50%;" id="jspsych-image-causation-slider-response-response"></input>';
    html += '<div>'
    for(var j=0; j < trial.labels.length; j++){
      var width = 100/(trial.labels.length-1);
      var left_offset = (j * (50 /(trial.labels.length - 1))) // - (width/4);
      html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
      html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
      html += '</div>'
    }
    html += '</div>';
    html += '</div>';
    html += '</div></center>';

    // add submit button
    html += '<center><button id="jspsych-image-causation-slider-response-next" class="jspsych-btn">'+trial.button_label+'</button></center>'; // modified by JL, centered

    display_element.innerHTML = html;

    document.getElementById('jspsych-image-causation-slider-response-next').style.visibility='hidden'; // hide submit button

    var response = {
      rt: null,
      response: null
    };

    // show continue button once initial response made
    display_element.querySelector('#jspsych-image-causation-slider-response-response').addEventListener('click', function() {

      curResponse = display_element.querySelector('#jspsych-image-causation-slider-response-response').value;

      var html = '<center><div id="jspsych-image-causation-slider-response-wrapper" style="margin: 100px 0px;">';

      if (trial.cover_text !== null) {
        html += trial.cover_text;
      }

      // stimuli
      html += '<center>' +
      '<img id="jspsych-image-causation-slider-response-multi2-stimulus_left" class="jspsych-image-causation-slider-response-multi2-stimulus" src="'+trial.stimulus_left+'"></img>'+
      '<img id="jspsych-image-causation-slider-response-multi2-stimulus_centre" class="jspsych-image-causation-slider-response-multi2-stimulus" src="'+trial.stimulus_centre+'"></img>'+
      '<img id="jspsych-image-causation-slider-response-multi2-stimulus_right" class="jspsych-cimage-causation-slider-response-multi2-stimulus" src="'+trial.stimulus_right+'"></img>';

      // prompt
      if (trial.prompt !== null){
        html += trial.prompt;
      }

      // slider
      html += '<div class="jspsych-image-causation-slider-response-container" style="position:relative;">';
      html += '<input type="range" value="'+curResponse+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 50%;" id="jspsych-image-causation-slider-response-response"></input>';
      html += '<div>'
      for(var j=0; j < trial.labels.length; j++){
        var width = 100/(trial.labels.length-1);
        var left_offset = (j * (50 /(trial.labels.length - 1))) // - (width/4);
        html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
        html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
        html += '</div>'
      }
      html += '</div>';
      html += '</div>';
      html += '</div></center>';

      html += '<center><button id="jspsych-image-causation-slider-response-next" class="jspsych-btn">'+trial.button_label+'</button></center>';

      display_element.innerHTML = html;

      // when 'continue' button clicked
      display_element.querySelector('#jspsych-image-causation-slider-response-next').addEventListener('click', function() {

        // measure response time
        var endTime = (new Date()).getTime();
        response.rt = endTime - startTime;
        response.response = display_element.querySelector('#jspsych-image-causation-slider-response-response').value;

        if (trial.trial_type === 'CB') {
          test_CB.push(response.response);
        } else if (trial.trial_type === 'CD') {
          test_CD.push(response.response);
        } else if (trial.trial_type === 'CF') {
          test_CF.push(response.response);
        }

        if(trial.response_ends_trial){
          end_trial();
        } else {
          display_element.querySelector('#jspsych-image-causation-slider-response-next').disabled = true;
        }

      });

    });

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "response": response.response
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-causation-slider-response-stimulus').style.visibility = 'hidden';
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
