document.addEventListener('DOMContentLoaded', function () {

    fetchVotes();

    setInterval(() => {
        fetchVotes();
    }, 5000)

});


function fetchVotes() {
    const urlTokens = window.location.href.split('/');
    const roundId = urlTokens[urlTokens.length - 1];

    fetch('/vote/' + roundId)
        .then(response => {
            return response.json()
        })
        .then(response => {

            console.log(`response`, response)

            let d = response.map(player => {
                return `
<tr>
<td>
${player.preview_url}
</td>
<td>
${player.name}
</td>
<td>
${player.votes}
</td>
</tr>
`
            });

            document.querySelector('#data').innerHTML = d.join('');
        })
}