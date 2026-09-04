import { NextResponse } from "next/server";

// Let's import the array from a shared spot, but Next API routes might bundle it differently.
// For the prototype, we can just export a singleton from a lib file.
// But let's just make it simple: we'll simulate the cancel purely on the frontend for the moment, 
// or I'll quickly create a shared memory store.
