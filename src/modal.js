export function getModal(title,content,footer){

    const html = `<div class="modal fade" id="modal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <form id="myForm">
                <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">${title}</h5>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${footer}
                </div>
            </form>
        </div>
        </div>
    </div>
    `
    return html
}