test('fakeSocket', function() {
    expect(true).toBe(true);
});

export default {
    send(_: string | ArrayBufferLike | Blob | ArrayBufferView): void { },
    onmessage(_: MessageEvent<string>): any { },
    dispatch(event: string, payload: Record<string, any>) {
        this.onmessage(new MessageEvent(event, {
            data: JSON.stringify(payload),
        }));
    }
};
