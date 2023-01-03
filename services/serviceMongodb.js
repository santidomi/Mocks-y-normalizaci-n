async function connectMG() {
    try {
        await connect('mongodb+srv://santiagomorera:NBLW114i2jvyU60F@cluster0.1clmwkn.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
    } catch (e) {
        console.log(e);
        throw 'can not connect to the db';
    }
}

console.log('conectanto...');
await connectMG();
console.log('conectado!!!');