$(document).ready(() => {
    $("#input-search").on("keypress", searchBook);
});

function searchBook(element) {    
    if(element.which != 13) return;
    $(this).attr("disabled", "disabled");
    let searchParam = $(this).val();        
    $("#searchResults").collapse();
    $("#collapse-message").addClass("animated pulse infinite");  
    $.ajax({
        url: "http://127.0.0.1:51334/my/books/search",
        method: "GET",
        data: {searchParam},            
        success: (d) => {
            $(this).removeAttr("disabled");
            let parentDiv = $("<div class=\"row\"</div>");                     
            for(let i = 0; i < d.items.length; i++) {
                let bookData = d.items[i].volumeInfo;                    
                $(parentDiv).append(createBookListing(bookData, true));                
            }
            $("#searchResults div").replaceWith(parentDiv);
            $("#searchResults button").on("click", function () {                    
                let bookData = {
                    cover: $(this).data("cover"),
                    title: $(this).data("title"),
                    author: $(this).data("author"),
                    link: $(this).data("link")
                };
                listBook(bookData);
            });
        }
    });        
}

async function listBook(bookData) {    
    $.ajax({
        url: "http://127.0.0.1:51334/my/books/add",
        method: "POST",
        data: bookData,            
        success: (d) => {            
            let parentDiv;
            if($("#container-mybooks")) {
                parentDiv = $("#container-mybooks");
                $("#container-mybooks #mybooks_empty").remove();
                $(parentDiv).addClass("row");
                $(parentDiv).removeClass("container");
            } 
            else parentDiv = $("<div class=\"row\" id=\"container-mybooks\"></div>");            
            let bookData = {
                imageLinks: {smallThumbnail: d.book.cover},
                title: d.book.title,
                author: d.book.author,
                previewLink: d.book.link,
                id: d._id
            };                         
            $(parentDiv).append(createBookListing(bookData, false));
            $("#container-mybooks").replaceWith(parentDiv);
            $("html, body").animate({
                scrollTop: $("#container-mybooks").offset().top
            }, 500);
        }
    });
}

//buttonType = false -> button is "remove button"
function createBookListing(bookData, buttonType) {         
    let title = bookData.title;
    let author;
    try { author = bookData.authors[0]; }
    catch(e) {author = bookData.author; }
    let link = bookData.previewLink;
    let cover;
    let button;
    try { cover = bookData.imageLinks.smallThumbnail; }
    catch(e) { cover = "http://via.placeholder.com/100x150"; }
    if(buttonType)
        button = `<button class="btn btn-success" data-cover="${cover}" data-title="${title}" data-author="${author}" data-link="${link}">List for trade</button>`;           
    else
        button = `<button class="btn btn-danger" value="${bookData.id}">Remove</button>`;
    let resultsElem = 
        `<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card text-center">
                <img class="card-img-top" src="${cover}" alt="Card image cap">
                <div class="card-body">
                    <a href="${link}" target="_blank"><h5 class="card-title">${title}</h5></a>
                    <p class="card-text">${author}</p>                    
                    ${button}                 
                </div>
            </div>
        </div>`;
    return $(resultsElem);
}