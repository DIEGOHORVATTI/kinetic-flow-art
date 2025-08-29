import InputNode from './InputNode';
import ProcessNode from './ProcessNode';
import ConditionNode from './ConditionNode';
import OutputNode from './OutputNode';

export const nodeTypes = {
  input: InputNode,
  process: ProcessNode,
  condition: ConditionNode,
  output: OutputNode,
};

export {
  InputNode,
  ProcessNode,
  ConditionNode,
  OutputNode,
};