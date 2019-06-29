import { Router } from 'express';
import { createWorkspace } from '../util/workspace';
import dirTree from 'directory-tree';

const router = Router();


/**
 * get all workspaces
 */
router.get('/', async (req: any, res, next) => {
    const tree = dirTree("/some/path");

    res.send([]);
});

/**
 * get single workspace
 */
router.get('/:id', async (req: any, res, next) => {
    console.log(req.params.id, req.body);
});

/**
 * create workspace
 */
router.post('/', async (req: any, res) => {
    const workspaceName = req.body.name;
    const workspacePath: any = await createWorkspace(req.user, workspaceName);

    // valid workspace
    res.send({
        _id: workspacePath
    });
});

/**
 * update workspace
 */
router.put('/:id', async (req: any, res, next) => {
    console.log(req.params.id, req.body);
});

export default router;