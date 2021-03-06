import { Button, Divider, Icon, Modal, Upload, message } from 'antd';
import { DesError } from 'components/decorators';
import { observer } from 'mobx-react';
import * as React from 'react';
import Store from 'store/dataSource';
import RequestFiles from 'utils/RequestFiles';
/**
 * 导入导出
 */
@DesError
@observer
export class ImportModal extends React.Component<{ Store: Store }, any> {
    Store = this.props.Store;
    onTemplate() {
        this.Store.onTemplate()
    }
    onCancel() {
        this.Store.onPageState("visiblePort", false)
    }
    render() {
        const DraggerProps = {
            name: 'file',
            multiple: true,
            accept: ".xlsx,.xls",
            action: RequestFiles.FileTarget,
            onChange: info => {
                const status = info.file.status
                if (status !== 'uploading') {
                }
                if (status === 'done') {
                    const response = info.file.response
                    if (typeof response.Id === "string") {
                        // 导入
                        this.props.Store.onImport(response.Id)
                    } else {
                        message.error(`${info.file.name} ${response.message}`)
                    }
                } else if (status === 'error') {
                    message.error(`${info.file.name} 上传失败`)
                }
            },
            onRemove: (file) => {
                const response = file.response
                if (typeof response.Id === "string") {
                    RequestFiles.onFileDelete(response.Id)
                }
            },
        }
        return (
            <Modal
                title="导入"
                centered
                visible={this.Store.pageState.visiblePort}
                destroyOnClose={true}
                width={600}
                cancelText="取消"
                footer={null}
                onCancel={this.onCancel.bind(this)}
            >
                <div >
                    <div >
                        导入说明：请下载模版，然后在把信息输入到模版中   <Divider type="vertical" /> <Button icon="download" onClick={this.onTemplate.bind(this)}>下载模板</Button>
                    </div>
                    <Divider style={{ margin: "5px 0" }} />
                    <Upload.Dragger {...DraggerProps}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">单击或拖动文件到该区域上载</p>
                    </Upload.Dragger>
                </div>
            </Modal>
        );
    }
}