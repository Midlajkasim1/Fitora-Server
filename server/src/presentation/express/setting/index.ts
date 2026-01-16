import { DatabaseService } from "@/infrastructure/database/mongoose/connect.db";
import app from "./app";

const PORT = process.env.PORT || 4000;

const startServer = async ()=>{
    await DatabaseService.connect();

    app.listen(PORT,()=>{
        console.log(`Server started on http://localhost:${PORT}`);
    })
}
startServer()