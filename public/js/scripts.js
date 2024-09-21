$(document).ready(function () {
    const path = window.location.pathname;
    const escapedPath = $.escapeSelector(path);
    $(`a[href="${escapedPath}"]`).addClass('active');

    $(".livesearch").chosen();
});

function confirmDelete(entityId, entity_name = '') {
    if (
        confirm(`You really want to delete this ${entity_name}?`) &&
        entity_name
    ) {
        fetch(`/${entity_name}s/delete/${entityId}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    window.location.replace(`/${entity_name}s/`);
                } else {
                    alert('Error deleting record');
                }
            })
            .catch((error) => {
                console.error('Error deleting record:', error);
                alert('Error deleting record');
            });
    }
}