# HTML Rewriter

This is an implementation of Cloudflare's HTML Rewriter for use in Deno, however
it does not include support for async-handlers.

## Usage

```ts
import { 
  HTMLRewriter, init, Element
} from 'https://deno.land/x/htmlrewriter/src/index.ts'

// Call this once, and before calling HTMLRewriter
await init();

function rewriter(response: Response): Response {
    return new HTMLRewriter()
        .on("*", {
            element(element: Element) { 
                console.log(`Incoming element: ${element}`);
            },
            comments(comment: Comment) {
                console.log(`Incoming comment: ${comment}`);
            },
            text(text: TextChunk) {
                console.log(`Incoming text-chunk: ${text}`);
            }
        })
        .onDocument({
            doctype(doctype: Doctype){
                console.log('Incoming doctype':, doctype);
            },
            comments(comment: Comment){
                console.log('Incoming comment':, comment);
            },
            text(text: TextChunk){
                console.log('Incoming text-chunk':, text);
            },
            end(end: DocumentEnd){
                console.log('incoming document-end:', end);
            }
        })
        .transform(response)
}

rewriter(new Response('<p class="red">test</p>'))
```

## Building

Make sure you have `rustup` and `wasm-pack` installed. Then run

```sh
deno run --allow-run --allow-write ./scripts/build.ts
```

This will compile `lol-html` to WASM, which is what powers the html rewriting
functionality.

## License

This project is licensed under the BSD 3-Clause license.

`htmlrewriter` is based on
[remorses/htmlrewriter](https://github.com/remorses/htmlrewriter) which is BSD
3-Clause licensed.
