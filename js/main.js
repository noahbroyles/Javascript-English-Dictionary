/*
 * Name: Noah Broyles
 * Email: broylend@mail.uc.edu
 * Assignment: Final Exam
 * Due Date: 12/06/2020
 * Description: This script controls a dictionary lookup API
 * References: https://www.jsdiaries.com/how-to-loop-through-json-in-javascript/, https://stackoverflow.com/questions/2955947, https://stackoverflow.com/questions/12948853, https://stackoverflow.com/questions/1915007
 */

'use strict';

function logWordLookup(word) {
    $.ajax({
        url: "https://homepages.uc.edu/~broylend/javascript/dictionary-final/dictlog.php",
        type: "POST",
        data: {word: word}
    });
}

function lookupWord (word) {
    if (word === undefined) {
        word = $("#word-box").val();
    }

    logWordLookup(word);

    let html = ``;
    $('.results').html(html); // clear previous results

    $.ajax({
        url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
        type: "GET",
        dataType: "json",
        statusCode: {

            200: function (response) {
                html += `<h1>${response[0].word}</h1>`;
                
                // show phonetics for the word if available
                if (response[0].phonetics.length !== 0) {
                    if (response[0].phonetics[0].text != undefined) {
                        html += `<h1 class="pronunciation">${response[0].phonetics[0].text}</h1>`;
                    }
                    // Show the audio for the pronunciation of the word if available
                    if (response[0].phonetics[0].audio != undefined) {
                        html += `<div class="audio-container"><audio src=${response[0].phonetics[0].audio} controls>Your browser doesn't support HTML5 audio. Get a new one.</audio></div>`;
                    }
                }

                for (let w = 0; w < response.length; w++) {
                    let currentWord = response[w];

                    if (currentWord.meanings.length == 0) {
                        html += `<h2>"${response[0].word}" found in the dictionary but no definitions are available</h2>`;
                    }

                    for (let m = 0; m < currentWord.meanings.length; m++) {

                        // if there is more than one meaning or word, allow collapsing definitions
                        if (response.length > 1 || currentWord.meanings.length > 1) {
                            html += `<div class="meaning"><h2 class="collapsable" title="${currentWord.meanings[m].definitions[0].definition.length > 68 ? currentWord.meanings[m].definitions[0].definition.substring(0, 65) + "..." : currentWord.meanings[m].definitions[0].definition.substring(0, 68)}&#013;Click to expand/collapse">${currentWord.word}: <em>${currentWord.meanings[m].partOfSpeech}</em></h2>`;
                        } else {
                            html += `<div class="meaning"><h2>${currentWord.word}: <em>${currentWord.meanings[m].partOfSpeech}</em></h2>`;
                        }
                        
                        // display word origin if there is one
                        if (currentWord.origin != undefined) {
                            html += `<h3 class="origin">Origin: ${currentWord.origin}</h3>`;
                        }

                        // display the definitions
                        for (let d = 0; d < currentWord.meanings[m].definitions.length; d++) {
                            html += `<div class="definition"><p>${d+1}. ${currentWord.meanings[m].definitions[d].definition}</p>`;
                            if (currentWord.meanings[m].definitions[d].example != undefined) {
                                html += `<ul class="examples"><li>Example: <span class="example">${currentWord.meanings[m].definitions[d].example}</span></li></ul>`;
                            }
                            if (currentWord.meanings[m].definitions[d].synonyms != undefined) {
                                html += `<h3 class="synonyms">Synonyms:</h3>`
                                html += `<ul>`
                                for (let s = 0; s < currentWord.meanings[m].definitions[d].synonyms.length; s++) {
                                    html += `<li><span class="synonym">${currentWord.meanings[m].definitions[d].synonyms[s]}</span></li>`
                                }
                                html += `</ul>`; // close the synonym ul
                            }
                            html += `</div>`; // close the definition div
                        }
                        html +=`</div>`; // close the meaning div
                    }
                }

                // add the generated HTML to the results class
                $('.results').append(html);

                // update the url
                const url = `https://homepages.uc.edu/~broylend/javascript/dictionary-final/?word=${word}`;
                window.history.pushState("<html>" + $("html").html() + "</html>", 'English Dictionary', url);

                // look up any clicked synonyms
                $(".synonym").click(function() {
                    lookupWord($(this).html());
                    $("#word-box").val($(this).html());
                });

                // make some results collapsable
                $(".collapsable").click(function () {
                    $(this).parent().find('div').toggle();
                });
                // collapse all except first definition
                $(".collapsable").map(function() {
                    $(this).parent().find('div').hide();
                });

                // show the results in 1 second
                $('.results').show(1000); 
            },

            404: function() {
                $('#word-box').val("");
                $('.results').html(`<h1>"${word}" not found in the dictionary</h1>`);
                // show the results in half a second
                $('.results').show(500);
            }
        },

    });
}

$(document).ready(function () {
    $(".results").hide();
    // lookup words on button click
    $('#lookup-word-btn').click(function() {
        lookupWord();
    });
    // lookup words on Enter press
    $('#word-box').on("keypress", function(e) {
        if (e.keyCode == 13) {
            lookupWord();
        }
    });

    const qs = window.location.search;
    const urlParams = new URLSearchParams(qs);
    const word = urlParams.get("word");

    if (word !== null) {
        $("#word-box").val(word);
        lookupWord(word);
    }

    $('#word-box').focus();
});