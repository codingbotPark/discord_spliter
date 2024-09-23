import { Express } from "express";
import Employee from "./Employee";

// Manager interface role = manager's 
export default abstract class Manager extends Employee{
    abstract manage(app:Express | undefined):void
}
