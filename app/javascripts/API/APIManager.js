export class APIManager {
    static calcCircuit(circuit) {
        return new Promise(function(resolve, reject) {
            var url = 'http://localhost:8081/calcCircuit';
            debugger;
            $.post({
                url: url,
                data: JSON.stringify(circuit),
                contentType: "application/json",
            }).done((data) => {
                resolve(data);
            }).error((response, status, error) => {
                reject(response, status, error);
            });
        });
    }
}