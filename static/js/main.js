import Book from './Book.js';

document.addEventListener('DOMContentLoaded', () => {
    //ページ読込時にGet送信する
    let container = document.querySelector('.container');

    fetch("/todos")
        .then(response => response.json())
        .then(books => {
            for (let row of books) {
                let book = new Book(row)//クラスメソッドを使いたいので、インスタンス作る
                addBook(book.toHtml());
            }
            //イベントハンドラの設定。Getが完了する前に設定してしまうと、
            //データを完全に取得する前にユーザーがPOSTしてしまうかもしれない。
            // GETのかっこでイベントハンドラを設定する事で絶対最新のデータが表示される。
            const botton = document.querySelector('#submitNewBook');
            botton.onclick = e => {
                e.preventDefault();
                let book = {
                    'title': document.querySelector('input[name="title"]').value,
                    'author': document.querySelector('input[name="author"]').value,
                    'description': document.querySelector('input[name="description"]').value,
                    'reference': document.querySelector('input[name="reference"]').value
                }
                // フォーム入力時にPOST送信する
                fetch('/todos', {
                    method: 'POST',
                    body: JSON.stringify(book),
                    headers: { 'Content-Type': 'application/json' }
                }).then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Error in network response');
                }).then(books => {
                    while (container.firstChild) {
                        container.firstChild.remove()
                    }
                    for (let row of books) {
                        let book = new Book(row)
                        addBook(book.toHtml());
                    }
                    document.querySelector('input[name="title"]').value = '';
                    document.querySelector('input[name="author"]').value = '';
                    document.querySelector('input[name="description"]').value = '';
                    document.querySelector('input[name="reference"]').value = '';
                }).catch(error => console.error('Error:', error));


            };
        });

    function addBook(book) {
        let button = document.createElement('button');
        let moreContent = book.querySelector('#more-content')
        button.addEventListener('click', () => {
            
            moreContent.style.display = 'block';  // もっと見る内容を表示
            button.textContent = '閉じる'// もっと見るボタンを非表示にする
        });
        button.textContent = '続きを見る'
        book.appendChild(button)

        container.appendChild(book);

    }


});

