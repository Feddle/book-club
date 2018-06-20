$(document).ready(() => {
    $("#input-search").on("keypress", searchBookHandler);
    $("#searchResults").on("click", "button", function () {                    
        let bookData = {
            cover: $(this).data("cover"),
            title: $(this).data("title"),
            author: $(this).data("author"),
            link: $(this).data("link")
        };
        listBook(bookData);
    });
});

async function searchBookHandler(element) {    
    if(element.which != 13) return;
    $(this).attr("disabled", "disabled");
    let searchParam = $(this).val();        
    $("#searchResults").collapse();
    $("#collapse-message").addClass("animated pulse infinite"); 
    let searchResults = await searchBooks(searchParam);             
    $(this).removeAttr("disabled");
    let parentDiv = $("<div class=\"row\"</div>");                     
    for(let i = 0; i < searchResults.items.length; i++) {
        let bookData = searchResults.items[i].volumeInfo;                    
        $(parentDiv).append(createBookCard(bookData, true));                
    }
    $("#searchResults div").replaceWith(parentDiv);        
}

async function searchBooks(searchParam) {
    return $.ajax({
        url: "http://127.0.0.1:51334/my/books/search",
        method: "GET",
        data: {searchParam},            
        success: (d) => {
            return d;
        }
    });
}

async function listBook(bookData) {
    let data = await postBookData(bookData);
    let myBooksContainer = createMyBooksContainer();
    let bookDataForView = formatBookData(data);
    let bookCard = createBookCard(bookDataForView, false);
    $(myBooksContainer).append(bookCard);
    $("#container-mybooks").replaceWith(myBooksContainer);
    $("html, body").animate({
        scrollTop: $("#container-mybooks").offset().top
    }, 500);    
}

function postBookData(bookData) {
    return $.ajax({
        url: "http://127.0.0.1:51334/my/books/add",
        method: "POST",
        data: bookData,            
        success: (d) => {            
            return d;
        }
    });
}

function createMyBooksContainer() {
    let myBooksContainer;
    if($("#container-mybooks")) {
        myBooksContainer = $("#container-mybooks");
        $("#container-mybooks #mybooks_empty").remove();
        $(myBooksContainer).addClass("row").removeClass("container");
    } 
    else myBooksContainer = $("<div class=\"row\" id=\"container-mybooks\"></div>");
    return myBooksContainer;
}

function formatBookData(data) {
    return {
        imageLinks: {smallThumbnail: data.book.cover},
        title: data.book.title,
        author: data.book.author,
        previewLink: data.book.link,
        id: data._id
    }; 
}

//buttonType = false -> button is "remove button"
function createBookCard(bookData, buttonType) {         
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