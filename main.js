$(".note").hide()
$(".create-note-modal").hide()
$(".input-container").hide()

let renaming = false
let elementBeingRenamed
let elementIndex
let noteObj = {
    noteName : "",
    noteDate : "",
    noteContent : ""
    }
let noteStorage = []
let searchInput

console.log(noteStorage != null)

function loadNotes(){
    noteStorage = JSON.parse(localStorage.getItem("notes"))
    console.log(noteStorage)

    for(let i = 0; i < noteStorage.length; i++){
        let noteCopy = $(".note").clone(true).first()
        noteCopy.css({"display" : "grid"})

        noteCopy.children(".note-info").children(".note-name").text(noteStorage[i].noteName)
        noteCopy.children(".note-info").children(".note-date").text(noteStorage[i].noteDate)
        noteCopy.appendTo(".note-list")
    }
    $(".note").first().remove()
}

function noteSelectedHandler(noteSelected){
    $(".note").each(function(){
        if($(this).hasClass("note-clicked")) {$(this).toggleClass("note-clicked")}
    })
    noteSelected.toggleClass("note-clicked")
}

$(document).ready(function() {
    
    if(noteStorage != null){ loadNotes() }

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
            let noteCopy = $(".note").clone(true).first()
            
            noteCopy.css({"display" : "grid"})

            noteCopy.children(".note-info").children(".note-name").text($("#note-name-input").val())
            noteCopy.children(".note-info").children(".note-date").text(today.toDateString())
            noteCopy.appendTo(".note-list")
            
            noteObj = {}
            noteObj.noteName = noteCopy.children(".note-info").children(".note-name").text()
            noteObj.noteDate = noteCopy.children(".note-info").children(".note-date").text()

            noteStorage.push(noteObj)
            localStorage.setItem("notes", JSON.stringify(noteStorage))
            $(".input-container").show()

            noteSelectedHandler(noteCopy)
        }else{
            elementBeingRenamed.text($("#note-name-input").val())
            noteStorage[elementIndex].noteName = elementBeingRenamed.text()
        }

        $("#note-name-input").val("")
    })

    $("#save-note-btn").click(function(){
        noteStorage[elementIndex].noteContent = $(".note-input").val()
        localStorage.setItem("notes", JSON.stringify(noteStorage))
    })

    $(".note").click(function(){

        noteSelectedHandler($(this))

        elementIndex = $(this).index() - 1
        $(".input-container").show()
        $(".note-input").val(noteStorage[elementIndex].noteContent)
        console.log(elementIndex)
    })

    $(".note-rename-btn").click(function(){
        renaming = true
        $("#create-note").text("Rename Note")
        $(".create-note-modal").fadeIn()
        elementBeingRenamed = $(this).parent().siblings(".note-info").children(".note-name")
        elementIndex = $(".note").index($(this).parent().parent())  //remove -1 when the first note (for cloning) is gone
        console.log(elementIndex)
    })

    $(".note-delete-btn").click(function(){
        elementIndex = $(".note").index($(this).parent().parent()) //remove -1 when the first note (for cloning) is gone
        $(this).parent().parent().remove()
        console.log(elementIndex)
        noteStorage.splice(elementIndex, 1)
        localStorage.setItem("notes", JSON.stringify(noteStorage))
    })

    $("#search-input").on("keyup", function(){
        searchInput = $(this).val().toLowerCase()
        let inputCharCheckLength = searchInput.length

        $(".note").each(function(){
            let noteName = $(this).children(".note-info").children(".note-name").text()

            if(searchInput.length < 1){ //if string is empty show all notes
                $(this).show()
            }
            else if(noteName.slice(0, inputCharCheckLength) != searchInput.slice(0, inputCharCheckLength)){ //if current characters in input do not equal note name, then hide note
                $(this).hide()
            }
            else{
                $(this).show()
            }
        })
    })
});