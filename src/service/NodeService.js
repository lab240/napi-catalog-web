export const NodeService = [
    {
        key: '0',
        data: {
            name: 'Applications',
            type: 'Folder'
        },
        children: [
            {
                key: '0-0',
                data: {
                    name: 'Vue',
                    type: 'Folder'
                },
                children: [
                    {
                        key: '0-0-0',
                        data: {
                            name: 'vue.app',
                            type: 'Application'
                        }
                    },
                    {
                        key: '0-0-1',
                        data: {
                            name: 'native.app',
                            type: 'Application'
                        }
                    },
                    {
                        key: '0-0-2',
                        data: {
                            name: 'mobile.app',
                            size: '5kb',
                            type: 'Application'
                        }
                    }
                ]
            },
            {
                key: '0-1',
                data: {
                    name: 'editor.app',
                    size: '25kb',
                    type: 'Application'
                }
            },
            {
                key: '0-2',
                data: {
                    name: 'settings.app',
                    size: '50kb',
                    type: 'Application'
                }
            }
        ]
    },
]
