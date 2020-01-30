$(".note").hide()
$(".create-note-modal").hide()
$(".input-container").hide()

let renaming = false
let noteBeingRenamed
let noteIndex
let noteObj = {
    Name : "",
    Date : "",
    Content : ""
    }
let noteStorage = JSON.parse(localStorage.getItem("notes")) || []
let searchInput
let noteClone

function loadNotes(){

    if(noteStorage && noteStorage.length !== 0){
        for(let i = 0; i < noteStorage.length; i++){
            let noteCopy = noteClone.clone(true)
            noteCopy.css({"display" : "grid"})
    
            noteCopy.children(".note-info").children(".note-name").text(noteStorage[i].Name)
            noteCopy.children(".note-info").children(".note-date").text(noteStorage[i].Date)
            noteCopy.appendTo(".note-list")
        }
    }
}

function noteSelectedHandler(noteSelected){
    $(".note").each(function(){
        if($(this).hasClass("note-clicked")) {$(this).toggleClass("note-clicked")}
    })
    noteSelected.toggleClass("note-clicked")
}

$(document).ready(function() {
    noteClone = $(".note").clone(true).first() //cloning HTML element template of note
    $(".note").first().remove() //removing template

    loadNotes()

    $("#new-note-btn").click(function(){
        $(".create-note-modal").fadeIn()
        renaming = false
        $("#create-note").text("Create Note")
    }) 

    $("#close-modal").click(function(){
        $(".create-note-modal").fadeOut()
    })

    $("#create-note-btn").click(function(){
        $(".create-note-modal").fadeOut()
        
        if(!renaming){
            var today = new Date();
            
            let newNote =  noteClone.clone(true)
            newNote.css({"display" : "grid"})

            newNote.children(".note-info").children(".note-name").text($("#note-name-input").val())
            newNote.children(".note-info").children(".note-date").text(today.toDateString())
            newNote.appendTo(".note-list")
            
            noteObj = {}
            noteObj.Name = newNote.children(".note-info").children(".note-name").text()
            noteObj.Date = newNote.children(".note-info").children(".note-date").text()
            noteObj.Content = ''

            noteStorage.push(noteObj)
            localStorage.setItem("notes", JSON.stringify(noteStorage))
            $(".note-input").val(noteObj.Content)
            $(".input-container").show()

            noteSelectedHandler(newNote)
        }else{
            noteBeingRenamed.text($("#note-name-input").val())
            noteStorage[noteIndex].Name = noteBeingRenamed.text()
            localStorage.setItem("notes", JSON.stringify(noteStorage))
        }
        $("#note-name-input").val("")
    })

    $("#save-note-btn").click(function(){
        noteStorage[noteIndex].Content = $(".note-input").val()
        localStorage.setItem("notes", JSON.stringify(noteStorage))
    })

    $(".note-list").on("click", ".note", function(){  //note click

        noteSelectedHandler($(this))

        noteIndex = $(this).index()
        $(".input-container").show()
        $(".note-input").val(noteStorage[noteIndex].Content)
    })

    $(".note-list").on("click", ".note .note-edit .note-rename-btn", function(){ //rename button click
        renaming = true
        $("#create-note").text("Rename Note")
        $(".create-note-modal").fadeIn()
        noteBeingRenamed = $(this).parent().siblings(".note-info").children(".note-name")
        noteIndex = $(".note").index($(this).parent().parent())
    })

    $(".note-list").on("click", ".note .note-edit .note-delete-btn", function(e){ //delete button click
        noteIndex = $(".note").index($(this).parent().parent())
        noteStorage.splice(noteIndex, 1)
        localStorage.setItem("notes", JSON.stringify(noteStorage))
        $(this).parent().parent().remove()

        e.stopPropagation(); //stops future events from firing (used for note clicked)
    })

    $("#search-input").on("keyup", function(){
        searchInput = $(this).val().toLowerCase()
        let inputCharCheckLength = searchInput.length

        $(".note").each(function(){
            let Name = $(this).children(".note-info").children(".note-name").text()

            if(searchInput.length < 1){ //if string is empty show all notes
                $(this).show()
            }
            else if(Name.slice(0, inputCharCheckLength) != searchInput.slice(0, inputCharCheckLength)){ //if current characters in input do not equal note name, then hide note
                $(this).hide()
            }
            else{
                $(this).show()
            }
        })
    })
});
