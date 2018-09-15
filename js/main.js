'use strict'
var userBooks = [];

function getBooks(userSubj, el) {
	reset(el);
	let endpoint = 'https://www.googleapis.com/books/v1/volumes?q=' + userSubj;
	let success = function() {
		return function(data) {
			for(var i = 0; i < data.items.length; i++) {
				let newBook = new Book(data.items[i]);
					newBook.populate(el);
					userBooks.push(newBook);
			}
		}
	}
	let call = {
		url: endpoint,
		dataType: 'json',
		success: success(),
		type: 'GET'
	}
	$.ajax(call);
}

function reset(el) {
	userBooks = [];
	el.innerHTML = '';
}

function Book(book) {
	this.title = book.volumeInfo.title;
	this.authors = format('authors', book.volumeInfo.authors);
	this.desc = format('desc', book.volumeInfo.description);
	this.link = book.volumeInfo.previewLink;
	this.cover = book.volumeInfo.imageLinks.thumbnail;
}

function format(prop, val) {
	if(prop == 'desc') {
		if(val == undefined) {
			return 'No description is available for this title.';
		} else {
			return val;
		}
	} else if(prop == 'authors') {
		if(val.length > 1) {
			return val.join(', ');
		} else {
			return val;
		}
	}
}

Book.prototype.populate = function(el) {
	let bookDiv = document.createElement('div');
		bookDiv.classList.add('book');
		bookDiv.innerHTML = `
			<div class='left'>
				<a class='preview-link' href='` + this.link + `' target='_blank'>
					<img class='cover' src='` + this.cover + `' alt='` + this.title + ' cover' + `'>
				</a>
			</div>
			<div class='right'>
				<a class='preview-link' href='` + this.link + `' target='_blank'>
					<h2>` + this.title + `</h2>
				</a>
				<h6>` + this.authors + `</h6>
				<p>` + this.desc + `</p>
			</div>
		`;
	el.appendChild(bookDiv);
}