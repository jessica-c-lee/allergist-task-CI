/**
 * jspsych plugin for categorization trials with feedback
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org

 **/

// Modified by JL (2019)
// slider replaces forced-choice categorisation response

jsPsych.plugins['categorize-image-slider'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('categorize-image-slider', 'stimulus_left', 'image');
  jsPsych.pluginAPI.registerPreload('categorize-image-slider', 'stimulus_centre', 'image');
  jsPsych.pluginAPI.registerPreload('categorize-image-slider', 'stimulus_right', 'image');

  plugin.info = {
    name: 'categorize-image-slider',
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
      feedback_cover_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Feedback Cover Text',
        default: null,
        description: 'The text to be displayed at the top of the screen while feedback is presented.'
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
      key_answer: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Key answer',
        default: 50,
        description: 'The key to indicate the correct response.'
      },
      text_answer: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Text answer',
        default: null,
        description: 'Label that is associated with the correct answer.'
      },
      correct_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Correct text',
        default: "<p class='feedback'>Correct</p>",
        description: 'String to show when correct answer is given.'
      },
      incorrect_text: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Incorrect text',
        default: "<p class='feedback'>Incorrect</p>",
        description: 'String to show when incorrect answer is given.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      force_correct_button_press: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Force correct button press',
        default: false,
        description: 'If set to true, then the subject must press the correct response key after feedback in order to advance to next trial.'
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
      show_stim_with_feedback: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: true,
        no_function: false,
        description: ''
      },
      show_feedback_on_timeout: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show feedback on timeout',
        default: false,
        description: 'If true, stimulus will be shown during feedback. If false, only the text feedback will be displayed during feedback.'
      },
      timeout_message: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Timeout message',
        default: "<p>Please respond faster.</p>",
        description: 'The message displayed on a timeout non-response.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial'
      },
      feedback_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Feedback duration',
        default: 2500,
        description: 'How long to show feedback.'
      },
      stagger_elements_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stagger visual elements duration',
        default: 500,
        description: 'How long to delay staggered visual info.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    display_element.innerHTML = '';

    // show cover story text at top of screen
    if (trial.cover_text !== null) {
      display_element.innerHTML += trial.cover_text;
    }

    display_element.innerHTML += '<center>' +
    '<img id="jspsych-categorize-image-slider-stimulus_left" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_left+'"></img>'+
    '<img id="jspsych-categorize-image-slider-stimulus_centre" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_centre+'"></img>'+
    '<img id="jspsych-categorize-image-slider-stimulus_right" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_right+'"></img>'+
    '</center>';

    // hide image after time if the timing parameter is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-categorize-image-slider-stimulus_left').style.visibility = 'hidden';
        display_element.querySelector('#jspsych-categorize-image-slider-stimulus_centre').style.visibility = 'hidden';
        display_element.querySelector('#jspsych-categorize-image-slider-stimulus_right').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // stagger onset of choices after cues are presented
    if (trial.stagger_elements_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {

        display_element.innerHTML = '';

        // show cover story text at top of screen
        if (trial.cover_text !== null) {
          display_element.innerHTML += trial.cover_text;
        }

        // show stimuli
        display_element.innerHTML += '<center>' +
        '<img id="jspsych-categorize-image-slider-stimulus_left" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_left+'"></img>'+
        '<img id="jspsych-categorize-image-slider-stimulus_centre" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_centre+'"></img>'+
        '<img id="jspsych-categorize-image-slider-stimulus_right" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_right+'"></img>'+
        '</center>';

        var html = '';

        // show prompt
        if (trial.prompt !== null){
          html += trial.prompt;
        }

        // show slider
        html += '<center><div id="jspsych-categorize-image-slider-wrapper" style="margin: 100px 0px;">';
        html += '<div class="jspsych-categorize-image-slider-container" style="position:relative;">';
        html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 50%;" id="jspsych-categorize-image-slider-response"></input>';
        html += '<div>'
        for(var j=0; j < trial.labels.length; j++){
          var width = 100/(trial.labels.length-1);
          //var left_offset = (j * (100 /(trial.labels.length - 1))) - (width/2);
          var left_offset = (j * (50 /(trial.labels.length - 1))) - (width/4);
          html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
          html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
          html += '</div>'
        }
        html += '</div>';
        html += '</div>';
        html += '</div></center>';

        // add submit button
        html += '<center><button id="jspsych-categorize-image-slider-next" class="jspsych-btn">'+trial.button_label+'</button></center>';

        display_element.innerHTML += html;

        document.getElementById('jspsych-categorize-image-slider-next').style.visibility='hidden'; // hide submit button

        var response = {
          rt: null,
          response: null
        };

        // show continue button once initial response made
        display_element.querySelector('#jspsych-categorize-image-slider-response').addEventListener('click', function() {

          curResponse = display_element.querySelector('#jspsych-categorize-image-slider-response').value;

          // show stimuli
          display_element.innerHTML = '';

          // show cover story text at top of screen
          if (trial.cover_text !== null) {
            display_element.innerHTML += trial.cover_text;
          }

          // show stimuli
          display_element.innerHTML += '<center>' +
          '<img id="jspsych-categorize-image-slider-stimulus_left" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_left+'"></img>'+
          '<img id="jspsych-categorize-image-slider-stimulus_centre" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_centre+'"></img>'+
          '<img id="jspsych-categorize-image-slider-stimulus_right" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_right+'"></img>'+
          '</center>';

          var html = '';

          // show prompt
          if (trial.prompt !== null){
            html += trial.prompt;
          }

          // show slider
          html += '<center><div id="jspsych-categorize-image-slider-wrapper" style="margin: 100px 0px;">';
          html += '<div class="jspsych-categorize-image-slider-container" style="position:relative;">';
          html += '<input type="range" value="'+curResponse+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 50%;" id="jspsych-categorize-image-slider-response"></input>';
          html += '<div>'
          for(var j=0; j < trial.labels.length; j++){
            var width = 100/(trial.labels.length-1);
            var left_offset = (j * (50 /(trial.labels.length - 1))) - (width/4);
            html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
            html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
            html += '</div>'
          }
          html += '</div>';
          html += '</div>';
          html += '</div></center>';

          html += '<center><button id="jspsych-categorize-image-slider-next" class="jspsych-btn">'+trial.button_label+'</button></center>';

          display_element.innerHTML += html;

          // when 'continue' button clicked
          display_element.querySelector('#jspsych-categorize-image-slider-next').addEventListener('click', function() {

            // measure response time
            var endTime = (new Date()).getTime();
            response.rt = endTime - startTime;
            response.response = display_element.querySelector('#jspsych-categorize-image-slider-response').value;
            after_response();

            // save data
            trial_data = {
              "rt": response.rt,
              "left stimulus": trial.stimulus_left,
              "centre stimulus": trial.stimulus_centre,
              "right stimulus": trial.stimulus_right,
              "response": response.response
            };

            // if(trial.response_ends_trial){
            //   // end_trial();
            // } else {
            //   display_element.querySelector('#jspsych-categorize-image-slider-next').disabled = true;
            // }

          });

        });

      }, trial.stagger_elements_duration);
    }

    var trial_data = {};

    // create response function
    var after_response = function(info) {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // clear keyboard listener
      jsPsych.pluginAPI.cancelAllKeyboardResponses();
      display_element.innerHTML = '';
      var timeout = null;
      doFeedback(timeout)
    }

    function doFeedback(timeout) {

      if (timeout && !trial.show_feedback_on_timeout) {
        display_element.innerHTML += trial.timeout_message;
      } else {
        // show image during feedback if flag is set
        if (trial.show_stim_with_feedback) {
          if (trial.cover_text !== null) {
            display_element.innerHTML = trial.feedback_cover_text;
          }
          display_element.innerHTML += '<center>' +
          '<img id="jspsych-categorize-image-slider-stimulus_left" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_left+'"></img>'+
          '<img id="jspsych-categorize-image-slider-stimulus_centre" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_centre+'"></img>'+
          '<img id="jspsych-categorize-image-slider-stimulus_right" class="jspsych-categorize-image-slider-stimulus" src="'+trial.stimulus_right+'"></img>'+
          '</center>';
        }

        var atext = "";

        jsPsych.pluginAPI.setTimeout(function() {
        // show the feedback
        display_element.innerHTML += atext;
        display_element.innerHTML += '<center><img id="jspsych-categorize-image-slider-outcome_correct_O" class="jspsych-categorize-image-slider-outcome_correct_O" src="'+trial.text_answer+'"></img></center>';
      }, trial.stagger_elements_duration);
      }

      // check if force correct button press is set
      if (trial.force_correct_button_press && ((timeout && trial.show_feedback_on_timeout) || !timeout)) {

        var after_forced_response = function(info) {
          endTrial();
        }

        jsPsych.pluginAPI.getKeyboardResponse({
          callback_function: after_forced_response,
          valid_responses: [trial.key_answer],
          rt_method: 'date',
          persist: false,
          allow_held_key: false
        });

      } else {
        jsPsych.pluginAPI.setTimeout(function() {
          endTrial();
        }, trial.feedback_duration);
      }

    }

    function endTrial() {
      display_element.innerHTML = '';
      jsPsych.finishTrial(trial_data);
    }

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
