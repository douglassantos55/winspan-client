import { act, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Game from "../routes/Game";
import { Response, ServerImpl } from "../server";
import fakeSocket from "./_fakeSocket";

describe('Game', function() {
    const server = new ServerImpl(fakeSocket);
});
