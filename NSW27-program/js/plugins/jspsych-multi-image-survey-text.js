/**
 * jspsych-multi-image-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

 // Modified by JL (2019)

jsPsych.plugins['multi-image-survey-text'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'multi-image-survey-text',
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
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: undefined,
        description: 'Prompt for the subject to respond.'
      },
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: '',
            description: 'Prompts for the subject to response'
          },
          value: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            array: true,
            default: null,
            description: 'The strings will be used to populate the response fields with editable answers.'
          },
          rows: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Rows',
            array: true,
            default: 1,
            description: 'The number of rows for the response text box.'
          },
          columns: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Columns',
            array: true,
            default: 40,
            description: 'The number of columns for the response text box.'
          }
        }
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    if (typeof trial.questions[0].rows == 'undefined') {
      trial.questions[0].rows = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.questions[i].rows.push(1);
      }
    }
    if (typeof trial.questions[0].columns == 'undefined') {
      trial.questions[0].columns = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.questions[i].columns.push(40);
      }
    }
    if (typeof trial.questions[0].value == 'undefined') {
      trial.questions[0].value = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.questions[i].value.push("");
      }
    }

    var html = '';

    // stimuli
    html += '<center>' +
    '<img id="jspsych-multi-image-survey-text-stimulus_left" class="jspsych-multi-image-survey-text-stimulus" src="'+trial.stimulus_left+'"></img>'+
    '<img id="jspsych-multi-image-survey-text-stimulus_centre" class="jspsych-multi-image-survey-text-stimulus" src="'+trial.stimulus_centre+'"></img>'+
    '<img id="jspsych-multi-image-survey-text-stimulus_right" class="jspsych-multi-image-survey-text-stimulus" src="'+trial.stimulus_right+'"></img>'+
    '</center>';

    // show prompt
    if(trial.prompt !== null){
      html += '<div id="jspsych-multi-image-survey-text-prompt" class="jspsych-multi-image-survey-text-prompt">'+trial.prompt+'</div>';
    }

    // add questions
    for (var i = 0; i < trial.questions.length; i++) {
      html += '<center><div id="jspsych-multi-image-survey-text-"'+i+'" class="jspsych-multi-image-survey-text-question" style="margin: 2em 0em;">';
      html += '<p class="jspsych-multi-image-survey-text">' + trial.questions[i].prompt + '</p>';
      if(trial.questions[i].rows == 1){
        html += '<input type="text" name="#jspsych-multi-image-survey-text-response-' + i + '" size="'+trial.questions[i].columns+'" value="'+trial.questions[i].value+'"></input>';
      } else {
        html += '<textarea name="#jspsych-multi-image-survey-text-response-' + i + '" cols="' + trial.questions[i].columns + '" rows="' + trial.questions[i].rows + '">'+trial.questions[i].value+'</textarea>';
      }
      html += '</div></center>';
    }

    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-multi-image-survey-text-preamble" class="jspsych-multi-image-survey-text-preamble">'+trial.preamble+'</div>';
    }

    // add submit button
    html += '<center><button id="jspsych-multi-image-survey-text-next" class="jspsych-btn jspsych-multi-image-survey-text">'+trial.button_label+'</button></center>';

    display_element.innerHTML = html;

    display_element.querySelector('#jspsych-multi-image-survey-text-next').addEventListener('click', function() {

      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var matches = display_element.querySelectorAll('div.jspsych-multi-image-survey-text-question');
      for(var index=0; index<matches.length; index++){
        var id = "Q" + index;
        var val = matches[index].querySelector('textarea, input').value;
        var obje = {};
        obje[id] = val;
        Object.assign(question_data, obje);
      }
      
      // save data
      var trialdata = {
        "rt": response_time,
        "responses": JSON.stringify(question_data)
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
