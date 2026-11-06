# Deriving types for API boundaries

In Python, a report can turn a full task dictionary into a smaller dictionary.
Here the input has the same nested state shape as our TypeScript `Task`.

```python
def to_task_view(task):
    return {
        "id": task["id"],
        "title": task["title"],
        "state": task["state"]["kind"],
    }
```

The explicit field selection is what keeps labels and the details of each state
out of the result. In TypeScript, write that same projection and derive its
type from the trusted model.

<!-- snippet: src/task-views.ts#taskView -->
```ts
export type TaskView = Pick<Task, "id" | "title"> & {
  state: Task["state"]["kind"];
};

export function toTaskView(task: Task): TaskView {
  return { id: task.id, title: task.title, state: task.state.kind };
}
```

`Pick` selects named properties and keeps their types. `Task["state"]["kind"]`
looks up the type of the tag, so `state` is `"open" | "done" | "paused"`.
The `&` combines the selected fields with that flattened state field. Choose
derivation when the API should follow the domain type. Give an independently
versioned API its own type when changes to the domain should leave that API's
contract alone.

## Check both the type and the returned value

Predict what happens if you write `const summary: Pick<Task, "id" | "title"> = task`.
The assignment compiles because `task` has both required fields. The checker
rejects `summary.labels`, but the value still refers to the full task and would
serialize its extra fields. `Pick` has no effect on the JavaScript value.

The [checked examples](../tests/derived-api-types.test.ts) make both claims
observable. The compiler checks that the narrow type gives callers no access
to `labels` and that the view's state cannot be `"waiting"`. The runtime test
confirms that the narrow assignment retains `labels` and that projecting a
paused task returns exactly its ID, title, and state tag. Use both checks when
a boundary must control what callers see *and* what data leaves the module.
