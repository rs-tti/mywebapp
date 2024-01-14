export default class Book {
    constructor(book) {
        this.title = book.title;
        this.author = book.author;
        this.description = book.description;
        this.reference = book.reference;
    }

    // constructor(title, author, description) {
    //     this.title = title;
    //     this.author = author;
    //     this.description = description;
    // }

    toHtml() {
        let div = document.createElement('div');
        div.className = 'book';

        let h2 = document.createElement('h2');
        h2.textContent = this.title;
        div.appendChild(h2);

        let p = document.createElement('p');
        p.innerHTML = "著者<br>&nbsp;&nbsp;&nbsp;&nbsp;" + this.author;
        div.appendChild(p);

        let desc = document.createElement('p');
        desc.innerHTML = "概要<br>&nbsp;&nbsp;&nbsp;&nbsp;" +this.description;
        div.appendChild(desc);
        
        let ref_list = document.createElement('div');
        ref_list.id = "more-content"
        ref_list.innerHTML = "参考文献<br>&nbsp;&nbsp;&nbsp;&nbsp;";
        this.reference.forEach(path => {

            let ref
            if (path.startsWith('http')) {
                ref = document.createElement('a');
                ref.target = "_blank";
                ref.rel = "noopener noreferrer";
                ref.textContent = path;
                ref.href = path
            } else {
                ref = document.createElement('a');
                ref.addEventListener('click', function (event) {
                    var textToCopy = path;
                    navigator.clipboard.writeText(textToCopy).then(function () {
                        // 成功メッセージ
                        var message = 'パスがクリップボードにコピーされました!';

                        // メッセージ表示エリアを取得
                        var messageArea = document.createElement('div');
                        messageArea.className = 'flashMessage';

                        // メッセージを設定
                        messageArea.textContent = message;

                        // メッセージの位置をボタンの近くに設定
                        var rect = event.target.getBoundingClientRect();
                        messageArea.style.left = rect.left + rect.width + 'px';
                        messageArea.style.top = rect.top + 'px';

                        // メッセージをbody要素に追加
                        document.body.appendChild(messageArea);

                        // 3秒後にメッセージを非表示にする
                        setTimeout(function () {
                            messageArea.style.display = 'none';
                        }, 1500);
                    }).catch(function (error) {
                        console.error('テキストのコピーに失敗:', error);
                    });
                });
                let path_split = path.replace(/\\/g, "/");
                ref.href = '#'
                path_split = path_split.split('/')
                ref.textContent = path_split[path_split.length - 1];
            }
            ref_list.appendChild(ref);
        });
        div.appendChild(ref_list)

        return div;
    }
}